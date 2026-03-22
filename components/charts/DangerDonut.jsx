import { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5';
import { txApps } from '../../data/txApps';

const DANGER_COLORS_HEX = {
  extreme: '#dc2626',
  danger: '#ef4444',
  illegal: '#f97316',
  caution: '#eab308',
};

const DANGER_LABELS = {
  extreme: 'Extreme',
  danger: 'Danger',
  illegal: 'Illegal',
  caution: 'Caution',
};

const DANGER_ORDER = ['extreme', 'danger', 'illegal', 'caution'];

export default function DangerDonut({ onFilterDanger, activeFilter }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const hoverRef = useRef(null);
  const filterRef = useRef(activeFilter);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => { filterRef.current = activeFilter; }, [activeFilter]);

  const handleClick = useCallback((level) => {
    if (onFilterDanger) onFilterDanger(filterRef.current === level ? null : level);
  }, [onFilterDanger]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }

    const counts = {};
    const appsByLevel = {};
    txApps.forEach(a => {
      counts[a.danger] = (counts[a.danger] || 0) + 1;
      if (!appsByLevel[a.danger]) appsByLevel[a.danger] = [];
      appsByLevel[a.danger].push(a.name);
    });

    const data = DANGER_ORDER.map(d => ({ level: d, count: counts[d] || 0 }));
    const total = txApps.length;

    const sketch = (p) => {
      const SIZE = 220;
      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const outerR = 90;
      const innerR = 50;
      let sweepAngle = 0;
      let introProgress = 0;
      let arcs = [];
      const trails = [];

      p.setup = () => {
        p.createCanvas(SIZE, SIZE);
        p.textFont('monospace');
        p.textAlign(p.CENTER, p.CENTER);

        // Compute arc angles — must be inside setup so p.color() is available
        let angleOffset = -p.HALF_PI;
        data.forEach(d => {
          const span = (d.count / total) * p.TWO_PI;
          arcs.push({ ...d, startAngle: angleOffset, endAngle: angleOffset + span, color: p.color(DANGER_COLORS_HEX[d.level]) });
          angleOffset += span;
        });
      };

      p.draw = () => {
        p.clear();

        // Intro animation (arcs draw in over ~1.5 seconds)
        introProgress = p.min(introProgress + 0.02, 1);
        const eased = 1 - Math.pow(1 - introProgress, 3); // ease-out cubic

        // Slow sweep (one full rotation every ~12 seconds at 30fps)
        sweepAngle += 0.0087;
        if (sweepAngle > p.TWO_PI) sweepAngle -= p.TWO_PI;
        const sweepWorld = sweepAngle - p.HALF_PI;

        // Spawn trail particles along sweep line
        if (p.frameCount % 3 === 0 && introProgress >= 1) {
          const r = p.random(innerR + 4, outerR - 4);
          const sx = cx + Math.cos(sweepWorld) * r;
          const sy = cy + Math.sin(sweepWorld) * r;
          // Find which arc we're in
          let trailColor = p.color(255, 255, 255, 40);
          for (const arc of arcs) {
            let normSweep = sweepWorld;
            let normStart = arc.startAngle;
            let normEnd = arc.endAngle;
            // Normalize all to 0..TWO_PI for comparison
            while (normSweep < 0) normSweep += p.TWO_PI;
            while (normStart < 0) normStart += p.TWO_PI;
            while (normEnd < 0) normEnd += p.TWO_PI;
            if (normEnd < normStart) normEnd += p.TWO_PI;
            if (normSweep >= normStart && normSweep <= normEnd) {
              trailColor = p.color(p.red(arc.color), p.green(arc.color), p.blue(arc.color), 60);
              break;
            }
          }
          trails.push({ x: sx, y: sy, life: 1, color: trailColor, size: p.random(2, 4) });
        }

        // Update and draw trails
        for (let i = trails.length - 1; i >= 0; i--) {
          const t = trails[i];
          t.life -= 0.015;
          if (t.life <= 0) { trails.splice(i, 1); continue; }
          const c = t.color;
          p.noStroke();
          p.fill(p.red(c), p.green(c), p.blue(c), t.life * p.alpha(c));
          p.ellipse(t.x, t.y, t.size * t.life);
        }

        // Draw arcs
        const mx = p.mouseX;
        const my = p.mouseY;
        const mouseInCanvas = mx >= 0 && mx <= SIZE && my >= 0 && my <= SIZE;
        const distFromCenter = mouseInCanvas ? p.dist(mx, my, cx, cy) : 0;
        const mouseInRing = mouseInCanvas && distFromCenter >= innerR && distFromCenter <= outerR + 8;
        let mouseAngle = mouseInRing ? p.atan2(my - cy, mx - cx) : null;

        let hoveredArc = null;

        p.strokeWeight(1.5);
        p.stroke(8);
        arcs.forEach(arc => {
          const drawEnd = arc.startAngle + (arc.endAngle - arc.startAngle) * eased;

          // Check hover
          let isHovered = false;
          if (mouseAngle !== null) {
            let normMouse = mouseAngle;
            let normStart = arc.startAngle;
            let normEnd = arc.endAngle;
            // Simple in-range check
            if (normEnd > normStart) {
              isHovered = normMouse >= normStart && normMouse <= normEnd;
            } else {
              isHovered = normMouse >= normStart || normMouse <= normEnd;
            }
          }

          const r = isHovered ? outerR + 4 : outerR;
          const c = arc.color;

          if (isHovered) {
            hoveredArc = arc;
            // Glow effect
            p.noStroke();
            p.fill(p.red(c), p.green(c), p.blue(c), 15);
            p.arc(cx, cy, (r + 12) * 2, (r + 12) * 2, arc.startAngle, drawEnd);
            p.fill(8);
            p.ellipse(cx, cy, innerR * 2 - 4);
          }

          p.stroke(8);
          p.strokeWeight(2);
          p.fill(p.red(c), p.green(c), p.blue(c), isHovered ? 255 : 220);
          p.arc(cx, cy, r * 2, r * 2, arc.startAngle, drawEnd);
        });

        // Cut out center
        p.noStroke();
        p.fill(8);
        p.ellipse(cx, cy, innerR * 2);

        // Sweep line (subtle rotating radial)
        if (introProgress >= 1) {
          const sweepX = cx + Math.cos(sweepWorld) * outerR;
          const sweepY = cy + Math.sin(sweepWorld) * outerR;
          const sweepIx = cx + Math.cos(sweepWorld) * innerR;
          const sweepIy = cy + Math.sin(sweepWorld) * innerR;
          p.stroke(255, 255, 255, 12);
          p.strokeWeight(1);
          p.line(sweepIx, sweepIy, sweepX, sweepY);
        }

        // Center text
        p.noStroke();
        if (hoveredArc) {
          p.fill(p.red(hoveredArc.color), p.green(hoveredArc.color), p.blue(hoveredArc.color));
          p.textSize(18);
          p.drawingContext.font = 'bold ' + p.textSize() + 'px monospace';
          p.text(`${hoveredArc.count}`, cx, cy - 6);
          p.fill(200);
          p.textSize(10);
          p.drawingContext.font = p.textSize() + 'px monospace';
          p.text(DANGER_LABELS[hoveredArc.level], cx, cy + 12);
        } else {
          p.fill(255);
          p.textSize(20);
          p.drawingContext.font = 'bold ' + p.textSize() + 'px monospace';
          p.text(`${total}`, cx, cy - 6);
          p.fill(180);
          p.textSize(10);
          p.drawingContext.font = p.textSize() + 'px monospace';
          p.text('TX Apps', cx, cy + 12);
        }

        // Update React hover state (throttled)
        if (p.frameCount % 5 === 0) {
          const newHover = hoveredArc ? hoveredArc.level : null;
          if (hoverRef.current !== newHover) {
            hoverRef.current = newHover;
            if (hoveredArc) {
              const names = appsByLevel[hoveredArc.level]?.slice(0, 3).join(', ');
              setHoverInfo({ level: hoveredArc.level, count: hoveredArc.count, names });
            } else {
              setHoverInfo(null);
            }
          }
        }
      };

      p.mouseClicked = () => {
        if (hoverRef.current) {
          handleClick(hoverRef.current);
        }
      };
    };

    instanceRef.current = new p5(sketch, containerRef.current);
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [handleClick]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="rounded-lg cursor-pointer mx-auto [&>canvas]:block [&>canvas]:mx-auto"
        style={{ width: 220, height: 220 }}
        role="img"
        aria-label="Interactive donut chart showing TX app danger level distribution"
      />
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
        {DANGER_ORDER.map(level => {
          const count = txApps.filter(a => a.danger === level).length;
          const isActive = activeFilter === level;
          return (
            <button
              key={level}
              onClick={() => onFilterDanger && onFilterDanger(isActive ? null : level)}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${isActive ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/70'}`}
              aria-label={`Filter by ${DANGER_LABELS[level]} (${count} apps)`}
              aria-pressed={isActive}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DANGER_COLORS_HEX[level] }} />
              <span>{DANGER_LABELS[level]}</span>
              <span className="text-base-content/30">{count}</span>
            </button>
          );
        })}
        <button
          onClick={() => onFilterDanger && onFilterDanger(null)}
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${!activeFilter ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/70'}`}
          aria-label="Show all apps"
          aria-pressed={!activeFilter}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-base-content/30" />
          <span>All</span>
          <span className="text-base-content/30">{txApps.length}</span>
        </button>
      </div>
    </div>
  );
}
