import { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5';
import {
  MusicalNoteIcon,
  CpuChipIcon,
  SignalIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

// Visual config per signal (static — not in React state)
const SIGNAL_CONFIG = [
  { icon: MusicalNoteIcon, activeClass: 'btn-warning', color: '#facc15', ring: 'ring-warning/40' },
  { icon: CpuChipIcon, activeClass: 'btn-success', color: '#4ade80', ring: 'ring-success/40' },
  { icon: SignalIcon, activeClass: 'btn-secondary', color: '#a78bfa', ring: 'ring-secondary/40' },
];

const DEFAULT_SIGNALS = [
  { center: 0.31, width: 0.025, strength: 0.9, label: 'FM Station', freq: '101.1 MHz', enabled: true },
  { center: 0.69, width: 0.012, strength: 0.6, label: 'ISM Device', freq: '433.9 MHz', enabled: true },
  { center: 0.84, width: 0.038, strength: 0.35, label: 'Weak Signal', freq: '915 MHz', enabled: true },
];

const SPEED_MAP = [5, 15, 30];
const SPEED_LABELS = ['Slow', '1x', 'Fast'];

// Educational messages — toggle events
const TOGGLE_MESSAGES = {
  off: [
    'FM Station disabled — the bright band disappears. On a real device, you\'d see this when tuning away from an active broadcast frequency.',
    'ISM Device disabled — the signal vanishes. ISM devices like key fobs and weather sensors transmit in short bursts, so they naturally appear and disappear.',
    'Weak Signal disabled — the faint signal is gone. These hard-to-see signals are exactly why gain adjustment matters on a real HackRF.',
  ],
  on: [
    'FM Station active — a strong signal appears. FM broadcasts are usually the brightest, most consistent signals on the waterfall.',
    'ISM Device active — a medium-strength IoT signal. On a real waterfall, ISM devices show as intermittent colored bursts.',
    'Weak Signal active — barely visible above the noise floor. Try increasing gain to make it more visible (but watch the noise floor rise too).',
  ],
};

const CLIP_MESSAGE = 'Signal clipping — the 8-bit ADC is saturating. On a real HackRF, this means flat-topped waveforms and lost signal detail. Reduce gain to restore clarity.';

export default function WaterfallSim({ expanded = false }) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const instanceRef = useRef(null);
  const [gain, setGain] = useState(20);
  const [speed, setSpeed] = useState(0);
  const [signals, setSignals] = useState(DEFAULT_SIGNALS);
  const [paused, setPaused] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const gainRef = useRef(gain);
  const signalsRef = useRef(signals);
  const speedRef = useRef(speed);
  const pausedRef = useRef(false);
  const manualPauseRef = useRef(false);
  const eventsRef = useRef([]);
  const clipCooldownRef = useRef(0);

  useEffect(() => { gainRef.current = gain; }, [gain]);
  useEffect(() => { signalsRef.current = signals; }, [signals]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Hover-to-pause: mouse enters canvas area
  const handleMouseEnter = useCallback(() => {
    pausedRef.current = true;
    setPaused(true);
  }, []);

  // Mouse leaves canvas area — resume unless manually paused
  const handleMouseLeave = useCallback(() => {
    if (!manualPauseRef.current) {
      pausedRef.current = false;
      setPaused(false);
    }
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
  }, []);

  // Manual pause toggle (button / keyboard / touch)
  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    manualPauseRef.current = next;
    setPaused(next);
    if (!next && tooltipRef.current) tooltipRef.current.style.opacity = '0';
  }, []);

  const toggleSignal = useCallback((idx) => {
    setSignals(prev => {
      const sig = prev[idx];
      const wasEnabled = sig.enabled;
      const cfg = SIGNAL_CONFIG[idx];
      eventsRef.current.push({
        x: sig.center,
        y: 0,
        message: TOGGLE_MESSAGES[wasEnabled ? 'off' : 'on'][idx],
        color: wasEnabled ? '#888888' : cfg.color,
      });
      return prev.map((s, i) => i === idx ? { ...s, enabled: !s.enabled } : s);
    });
  }, []);

  // Recreate p5 instance when expanded changes
  useEffect(() => {
    if (!containerRef.current) return;

    if (instanceRef.current) {
      instanceRef.current.remove();
      instanceRef.current = null;
    }

    eventsRef.current = [];
    clipCooldownRef.current = 0;
    pausedRef.current = false;
    manualPauseRef.current = false;
    setPaused(false);
    setEventCount(0);

    const container = containerRef.current;
    const W = container.clientWidth || (expanded ? 600 : 320);
    const H = expanded ? 400 : 200;
    const AXIS_H = 20;
    const MARKER_W = 12;

    const sketch = (p) => {
      let waterfall;
      let frameCounter = 0;

      p.setup = () => {
        p.createCanvas(W, H);
        waterfall = p.createImage(W, H - AXIS_H);
        waterfall.loadPixels();
        for (let i = 0; i < waterfall.pixels.length; i += 4) {
          waterfall.pixels[i] = 8;
          waterfall.pixels[i + 1] = 8;
          waterfall.pixels[i + 2] = 8;
          waterfall.pixels[i + 3] = 255;
        }
        waterfall.updatePixels();
        p.frameRate(SPEED_MAP[speedRef.current]);
      };

      p.draw = () => {
        p.frameRate(SPEED_MAP[speedRef.current]);
        const isPaused = pausedRef.current;
        const g = gainRef.current / 100;
        const wfH = H - AXIS_H;
        frameCounter++;

        // === DATA GENERATION (skip when paused) ===
        if (!isPaused) {
          // Scroll waterfall down
          waterfall.loadPixels();
          for (let y = wfH - 1; y > 0; y--) {
            for (let x = 0; x < W; x++) {
              const dst = (y * W + x) * 4;
              const src = ((y - 1) * W + x) * 4;
              waterfall.pixels[dst] = waterfall.pixels[src];
              waterfall.pixels[dst + 1] = waterfall.pixels[src + 1];
              waterfall.pixels[dst + 2] = waterfall.pixels[src + 2];
            }
          }

          // Generate new top row + detect clipping
          let clipping = false;
          const activeSignals = signalsRef.current.filter(s => s.enabled);
          for (let x = 0; x < W; x++) {
            const normX = x / W;
            let intensity = (p.random(0.05, 0.15) + g * 0.3) * 255;

            activeSignals.forEach(s => {
              const dist = Math.abs(normX - s.center);
              const pixelWidth = s.width;
              if (dist < pixelWidth) {
                const falloff = 1 - (dist / pixelWidth);
                const signalPower = s.strength * falloff * falloff;
                intensity += signalPower * (0.5 + g) * 255 * (0.8 + p.random(0.4));
              }
            });

            if (intensity > 255) clipping = true;
            intensity = p.constrain(intensity, 0, 255);

            const idx = x * 4;
            if (intensity < 80) {
              waterfall.pixels[idx] = 5;
              waterfall.pixels[idx + 1] = intensity * 0.35;
              waterfall.pixels[idx + 2] = intensity * 0.5;
            } else if (intensity < 170) {
              const t = (intensity - 80) / 90;
              waterfall.pixels[idx] = t * 180;
              waterfall.pixels[idx + 1] = 80 + t * 175;
              waterfall.pixels[idx + 2] = 130 - t * 60;
            } else {
              const t = (intensity - 170) / 85;
              waterfall.pixels[idx] = 180 + t * 75;
              waterfall.pixels[idx + 1] = 255;
              waterfall.pixels[idx + 2] = 70 + t * 185;
            }
          }

          // Clipping event with cooldown — subtle, not distracting
          clipCooldownRef.current = Math.max(0, clipCooldownRef.current - 1);
          if (clipping && clipCooldownRef.current === 0) {
            clipCooldownRef.current = 200;
            eventsRef.current.push({
              x: null,
              y: 0,
              message: CLIP_MESSAGE,
              color: '#666666',
            });
          }

          waterfall.updatePixels();
        }

        // === RENDERING (always runs) ===

        // Frequency axis at top
        p.fill(20);
        p.noStroke();
        p.rect(0, 0, W, AXIS_H);
        p.stroke(60);
        p.strokeWeight(1);
        p.line(0, AXIS_H, W, AXIS_H);

        const ticks = 8;
        for (let i = 0; i <= ticks; i++) {
          const tx = (i / ticks) * W;
          p.stroke(60);
          p.line(tx, AXIS_H - 4, tx, AXIS_H);
        }

        // Signal position markers on axis (colored per signal)
        p.noStroke();
        p.textSize(expanded ? 11 : 9);
        signalsRef.current.forEach((s, si) => {
          if (!s.enabled) return;
          const sx = s.center * W;
          const cfg = SIGNAL_CONFIG[si];
          const c = p.color(cfg.color);
          p.fill(p.red(c), p.green(c), p.blue(c), 180);
          p.triangle(sx, AXIS_H, sx - 3, AXIS_H - 6, sx + 3, AXIS_H - 6);
          p.textAlign(p.CENTER);
          p.fill(224, 224, 224, 200);
          p.text(s.freq, sx, AXIS_H - 8);
        });

        // Axis edge labels
        p.fill(160, 160, 160, 120);
        p.textSize(expanded ? 10 : 8);
        p.textAlign(p.LEFT);
        p.text('1 MHz', 4, AXIS_H - 2);
        p.textAlign(p.RIGHT);
        p.text('6 GHz', W - 4, AXIS_H - 2);

        // Draw waterfall image
        p.image(waterfall, 0, AXIS_H);

        // === EVENT MARKERS ===
        const events = eventsRef.current;
        let hoveredEvt = null;
        const mouseInWf = p.mouseX >= 0 && p.mouseX <= W && p.mouseY > AXIS_H && p.mouseY < H;

        for (let i = events.length - 1; i >= 0; i--) {
          const evt = events[i];

          // Only scroll markers when not paused
          if (!isPaused) {
            evt.y += 1;
          }

          if (evt.y > wfH) {
            events.splice(i, 1);
            continue;
          }

          const drawY = evt.y + AXIS_H;
          const c = p.color(evt.color);
          const cr = p.red(c);
          const cg = p.green(c);
          const cb = p.blue(c);

          // Markers are very subtle when running, only visible when paused
          const markerAlpha = isPaused ? 180 : 30;
          const lineAlpha = isPaused ? 40 : 10;
          const mw = isPaused ? MARKER_W + 2 : MARKER_W;
          const ms = isPaused ? 5 : 3;

          // Horizontal line — very faint unless paused
          if (isPaused) {
            p.stroke(cr, cg, cb, lineAlpha);
            p.strokeWeight(1);
            p.line(mw, drawY, W, drawY);
          }

          // Small marker on left edge
          p.noStroke();
          p.fill(cr, cg, cb, markerAlpha);
          p.triangle(0, drawY - ms, 0, drawY + ms, mw, drawY);

          // Dot at signal's x position — only when paused
          if (evt.x !== null && isPaused) {
            const dotX = evt.x * W;
            p.fill(cr, cg, cb, 40);
            p.ellipse(dotX, drawY, 14, 14);
            p.fill(cr, cg, cb, 180);
            p.ellipse(dotX, drawY, 6, 6);
          }

          // Check hover proximity (only when paused — that's the whole point)
          if (isPaused && mouseInWf && Math.abs(p.mouseY - drawY) < 12) {
            hoveredEvt = { ...evt, drawY };
          }
        }

        // Update event count for React UI (throttled)
        if (frameCounter % 15 === 0) {
          setEventCount(events.length);
        }

        // === TOOLTIP ===
        const tooltip = tooltipRef.current;
        if (tooltip) {
          if (hoveredEvt) {
            tooltip.style.opacity = '1';
            tooltip.textContent = hoveredEvt.message;
            tooltip.style.borderLeftColor = hoveredEvt.color;
            const tooltipX = Math.min(Math.max(p.mouseX + 16, 4), W - 290);
            const tooltipY = hoveredEvt.drawY < H * 0.5
              ? hoveredEvt.drawY + 14
              : hoveredEvt.drawY - 80;
            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${tooltipY}px`;
          } else {
            tooltip.style.opacity = '0';
          }
        }

        // === PAUSED OVERLAY ===
        if (isPaused) {
          // Semi-transparent banner at top of waterfall
          p.noStroke();
          p.fill(10, 10, 10, 180);
          p.rect(0, AXIS_H, W, 22);

          p.textAlign(p.CENTER);
          p.textSize(expanded ? 11 : 10);
          p.fill(34, 211, 238, 230);
          const msg = events.length > 0
            ? `\u23F8  PAUSED \u2014 hover the ${events.length} marker${events.length !== 1 ? 's' : ''} to inspect`
            : '\u23F8  PAUSED \u2014 toggle a signal to create event markers';
          p.text(msg, W / 2, AXIS_H + 15);
        }

        // Signal labels at bottom
        p.fill(224, 224, 224, isPaused ? 100 : 160);
        p.noStroke();
        p.textSize(expanded ? 12 : 9);
        p.textAlign(p.CENTER);
        signalsRef.current.forEach(s => {
          if (!s.enabled) return;
          p.text(s.label, s.center * W, H - 8);
        });
      };
    };

    instanceRef.current = new p5(sketch, container);

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [expanded]);

  return (
    <div>
      <p className="text-sm text-base-content/60 mb-3">
        Simulates the PortaPack&apos;s waterfall display. Toggle signals and adjust gain to see the waterfall respond.
        <span className="text-base-content/40"> Hover the waterfall to pause and inspect event markers.</span>
      </p>

      {/* Canvas + tooltip wrapper — hover-to-pause zone */}
      <div
        className={`relative mb-3 rounded ${paused ? 'ring-1 ring-primary/30' : ''}`}
        style={{ width: '100%', height: expanded ? 400 : 200 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          className="rounded overflow-hidden bg-base-300"
          role="img"
          aria-label="Live waterfall display simulation. Hover to pause and inspect event markers."
          style={{ width: '100%', height: '100%' }}
        />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-base-300/95 text-xs p-2.5 rounded-lg max-w-[280px] leading-relaxed z-10 text-base-content/90 shadow-lg"
          style={{ opacity: 0, transition: 'opacity 0.15s' }}
        />
      </div>

      {/* Status bar: pause button + event count + color legend */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={togglePause}
          className={`btn btn-xs gap-1 ${paused ? 'btn-primary' : 'btn-ghost'}`}
          aria-label={paused ? 'Resume waterfall' : 'Pause waterfall'}
        >
          {paused
            ? <><PlayIcon className="w-3.5 h-3.5" aria-hidden="true" /> Resume</>
            : <><PauseIcon className="w-3.5 h-3.5" aria-hidden="true" /> Pause</>
          }
        </button>
        {eventCount > 0 && (
          <span className="text-xs text-base-content/50">
            {eventCount} event{eventCount !== 1 ? 's' : ''} on waterfall
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-base-content/40">Noise</span>
          <div className="h-2.5 w-24 rounded" style={{ background: 'linear-gradient(to right, #050820, #14b8a6, #eab308, #ffffff)' }} />
          <span className="text-xs text-base-content/40">Strong</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label htmlFor="waterfall-gain">Gain</label>
            <span className="font-mono text-primary">{gain}%</span>
          </div>
          <input
            id="waterfall-gain"
            type="range" min={5} max={90} value={gain}
            onChange={e => setGain(+e.target.value)}
            className="range range-primary range-xs w-full"
            aria-label="Waterfall gain control"
          />
          <p className="text-xs text-base-content/40 mt-1">
            Increase gain to reveal weak signals. Too much raises the noise floor and causes clipping.
          </p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label htmlFor="waterfall-speed">Scroll Speed</label>
            <span className="font-mono text-primary">{SPEED_LABELS[speed]}</span>
          </div>
          <input
            id="waterfall-speed"
            type="range" min={0} max={2} step={1} value={speed}
            onChange={e => setSpeed(+e.target.value)}
            className="range range-primary range-xs w-full"
            aria-label="Waterfall scroll speed"
          />
        </div>
      </div>

      {/* Signal toggles — each with unique color, icon, style */}
      <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Signal toggles">
        {signals.map((s, i) => {
          const cfg = SIGNAL_CONFIG[i];
          const Icon = cfg.icon;
          return (
            <button
              key={s.label}
              onClick={() => toggleSignal(i)}
              className={`btn btn-sm gap-1.5 ${s.enabled ? cfg.activeClass : 'btn-ghost'} ${s.enabled ? 'ring-2 ' + cfg.ring : ''}`}
              aria-pressed={s.enabled}
              aria-label={`${s.label} at ${s.freq}: ${s.enabled ? 'on' : 'off'}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="font-bold">{s.label}</span>
              <span className="opacity-70 text-xs">{s.freq}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
