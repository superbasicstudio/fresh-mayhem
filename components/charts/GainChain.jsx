import { useState } from 'react';
import * as d3 from 'd3';

/* ═══════════════════════════════════════════════════════════════
   Gain Chain Calculator — Interactive D3 Visualization
   Shows signal flow, danger level gauge, and power budget
   for the HackRF One R10C receive chain.
   ═══════════════════════════════════════════════════════════════ */

const MAX_TOTAL = 116; // 40 (LNA) + 62 (VGA) + 14 (AMP)
const SAFE_LIMIT = 50;
const CAUTION_LIMIT = 70;

// D3 color scale: maps total gain → color
const dangerColor = d3.scaleLinear()
  .domain([0, SAFE_LIMIT, CAUTION_LIMIT, MAX_TOTAL])
  .range(['#4ade80', '#4ade80', '#facc15', '#f43f5e'])
  .clamp(true);

// Educational insight based on current settings
function getInsight(total, amp, lna, vga) {
  if (total > CAUTION_LIMIT) return { text: 'High gain increases sensitivity but raises the noise floor significantly. Strong nearby signals will clip the 8-bit ADC.', color: '#f43f5e' };
  if (amp && total > SAFE_LIMIT) return { text: 'AMP active with elevated gain — max safe input is now just -5 dBm. Keep distance from strong emitters.', color: '#facc15' };
  if (amp) return { text: 'AMP provides +14 dB at the RF front-end before any filtering. Only use for weak, distant signals.', color: '#facc15' };
  if (lna === 0 && vga === 0) return { text: 'Zero gain — the ADC sees only the raw antenna signal with no amplification. Good for very strong local sources.', color: '#666' };
  if (total <= 36) return { text: 'Conservative settings. Good starting point for strong local signals. Increase VGA first if signal is too quiet.', color: '#4ade80' };
  return { text: 'Standard operating gains. Suitable for most RX tasks at typical distances.', color: '#4ade80' };
}

// RF sources for power budget visualization
const SOURCES = [
  { name: 'FM broadcast (5km)', dbm: -50 },
  { name: 'WiFi AP (3m)', dbm: -40 },
  { name: 'Key fob (1m)', dbm: -30 },
  { name: 'WiFi AP (0.3m)', dbm: -15 },
  { name: 'Cell tower (100m)', dbm: -5 },
  { name: 'Handheld 5W (1m)', dbm: 7 },
];

/* ── Signal Chain Flow Diagram ─────────────────────────────── */

function SignalChain({ lna, vga, amp, totalGain, expanded }) {
  const ampDb = amp ? 14 : 0;
  const color = dangerColor(totalGain);
  // Slow idle animation when inline, responsive speed when expanded/interacting
  const activeSpeed = Math.max(0.5, 1.8 - (totalGain / MAX_TOTAL) * 1.3);
  const speed = expanded ? activeSpeed : activeSpeed * 3.5;

  const stages = [
    { id: 'ant', label: 'ANT', sub: 'Antenna', db: 0, on: true, color: '#666' },
    { id: 'amp', label: 'AMP', sub: amp ? '+14 dB' : 'OFF', db: ampDb, on: amp, color: '#facc15' },
    { id: 'lna', label: 'LNA', sub: `${lna} dB`, db: lna, on: lna > 0, color: '#38bdf8' },
    { id: 'vga', label: 'VGA', sub: `${vga} dB`, db: vga, on: vga > 0, color: '#a78bfa' },
    { id: 'adc', label: 'ADC', sub: '8-bit', db: 0, on: true, color: '#666' },
  ];

  const W = 440, H = 56;
  const boxW = 66, boxH = 38;
  const gap = (W - stages.length * boxW) / (stages.length - 1);

  // Cumulative gain at each stage for particle brightness
  let cum = 0;
  const cumGains = stages.map(s => { cum += s.db; return cum; });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: expanded ? 60 : 52 }}
      role="img" aria-label="Signal chain: Antenna → AMP → LNA → VGA → ADC">
      <defs>
        {/* Glow filters for active stages */}
        {stages.map(s => (
          <filter key={s.id} id={`gc-glow-${s.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={s.db > 15 ? 3 : 0} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
      </defs>

      {stages.map((s, i) => {
        const x = i * (boxW + gap);
        const y = (H - boxH) / 2;
        const intensity = Math.min(1, cumGains[i] / 70);
        const isOn = s.on;

        return (
          <g key={s.id}>
            {/* Connecting line + animated particles to next stage */}
            {i < stages.length - 1 && (
              <g>
                <line
                  x1={x + boxW} y1={H / 2}
                  x2={x + boxW + gap} y2={H / 2}
                  stroke={isOn ? color : '#1a1a1a'}
                  strokeWidth={isOn ? 1.5 : 0.5}
                  opacity={isOn ? 0.2 : 0.1}
                  strokeDasharray={isOn ? 'none' : '2 3'}
                />
                {isOn && (
                  <>
                    {/* Primary particle */}
                    <circle r={expanded ? 2 + intensity * 2 : 1.5} opacity={expanded ? 0.6 + intensity * 0.4 : 0.2}>
                      <animate attributeName="fill" values={`${color};#fff;${color}`} dur={`${speed}s`} repeatCount="indefinite" />
                      <animateMotion dur={`${speed}s`} repeatCount="indefinite"
                        path={`M${x + boxW + 2},${H / 2} L${x + boxW + gap - 2},${H / 2}`} />
                    </circle>
                    {/* Trail particle — only in expanded mode */}
                    {expanded && (
                      <circle r={1.5} fill={color} opacity={0.25 + intensity * 0.2}>
                        <animateMotion dur={`${speed}s`} begin={`${speed * 0.45}s`} repeatCount="indefinite"
                          path={`M${x + boxW + 2},${H / 2} L${x + boxW + gap - 2},${H / 2}`} />
                      </circle>
                    )}
                  </>
                )}
              </g>
            )}

            {/* Stage box */}
            <rect x={x} y={y} width={boxW} height={boxH} rx={5}
              fill={isOn ? `${s.color}0d` : '#0a0a0a'}
              stroke={isOn ? `${s.color}50` : '#1a1a1a'}
              strokeWidth={isOn ? 1.2 : 0.5}
              filter={isOn && s.db > 15 ? `url(#gc-glow-${s.id})` : undefined}
              style={{ transition: 'fill 0.3s, stroke 0.3s' }}
            />

            {/* Stage label */}
            <text x={x + boxW / 2} y={y + 15} textAnchor="middle"
              fill={isOn ? '#ddd' : '#2a2a2a'} fontSize={10} fontWeight="bold" fontFamily="monospace"
              style={{ transition: 'fill 0.2s' }}>
              {s.label}
            </text>
            <text x={x + boxW / 2} y={y + 28} textAnchor="middle"
              fill={isOn ? s.color : '#1a1a1a'} fontSize={8} fontFamily="monospace"
              style={{ transition: 'fill 0.2s' }}>
              {s.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Radial Danger Gauge ───────────────────────────────────── */

function DangerGauge({ totalGain, expanded }) {
  const color = dangerColor(totalGain);
  const zone = totalGain <= SAFE_LIMIT
    ? { label: 'SAFE', desc: 'Normal' }
    : totalGain <= CAUTION_LIMIT
    ? { label: 'CAUTION', desc: 'Clipping risk' }
    : { label: 'HIGH GAIN', desc: 'Noise floor rises' };

  const outerR = 68;
  const innerR = 52;
  const W = 172, H = 104;
  const cx = W / 2, cy = 74;

  // d3 angle: 0 = 12 o'clock, clockwise.  -π/2 = left, π/2 = right
  const angleScale = d3.scaleLinear()
    .domain([0, MAX_TOTAL])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);

  const arcGen = d3.arc().innerRadius(innerR).outerRadius(outerR).cornerRadius(2);

  const bgPath = arcGen({ startAngle: -Math.PI / 2, endAngle: Math.PI / 2 });
  const safePath = arcGen({ startAngle: -Math.PI / 2, endAngle: angleScale(SAFE_LIMIT) });
  const cautionPath = arcGen({ startAngle: angleScale(SAFE_LIMIT), endAngle: angleScale(CAUTION_LIMIT) });
  const dangerPath = arcGen({ startAngle: angleScale(CAUTION_LIMIT), endAngle: Math.PI / 2 });
  const valuePath = arcGen({ startAngle: -Math.PI / 2, endAngle: angleScale(totalGain) });

  // Needle endpoint (d3 angle: sin=x, -cos=y from center)
  const needleAngle = angleScale(totalGain);
  const needleR = outerR + 3;
  const nx = Math.sin(needleAngle) * needleR;
  const ny = -Math.cos(needleAngle) * needleR;

  // Scale tick marks
  const ticks = [0, 20, 40, 50, 60, 70, 80, 100, 116];
  const majorTicks = [0, 50, 70, 116];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: expanded ? 210 : 180 }}
      role="img" aria-label={`Gain meter: ${totalGain} dB total, ${zone.label}`}>
      <defs>
        <filter id="gc-gauge-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gc-needle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g transform={`translate(${cx}, ${cy})`}>
        {/* Background track */}
        <path d={bgPath} fill="#0c0c0c" stroke="#1a1a1a" strokeWidth={0.5} />

        {/* Zone arcs (subtle tinted backgrounds) */}
        <path d={safePath} fill="#4ade8008" />
        <path d={cautionPath} fill="#facc1508" />
        <path d={dangerPath} fill="#f43f5e08" />

        {/* Active value arc — glows */}
        <path d={valuePath} fill={color} opacity={0.15} style={{ transition: 'all 0.3s ease-out' }} />
        <path d={valuePath} fill={color} opacity={expanded ? 0.3 : 0.15} filter="url(#gc-gauge-glow)"
          style={{ transition: 'all 0.3s ease-out' }}>
          {totalGain > CAUTION_LIMIT && (
            <animate attributeName="opacity" values={expanded ? "0.2;0.45;0.2" : "0.1;0.2;0.1"} dur={expanded ? "1.5s" : "4s"} repeatCount="indefinite" />
          )}
        </path>

        {/* Tick marks */}
        {ticks.map(t => {
          const a = angleScale(t);
          const isMajor = majorTicks.includes(t);
          const len = isMajor ? 6 : 3;
          const x1 = Math.sin(a) * (innerR - 1);
          const y1 = -Math.cos(a) * (innerR - 1);
          const x2 = Math.sin(a) * (innerR - 1 - len);
          const y2 = -Math.cos(a) * (innerR - 1 - len);
          const lx = Math.sin(a) * (innerR - 14);
          const ly = -Math.cos(a) * (innerR - 14);
          const tickColor = t <= SAFE_LIMIT ? '#4ade8040' : t <= CAUTION_LIMIT ? '#facc1540' : '#f43f5e40';
          return (
            <g key={t}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMajor ? tickColor : '#222'} strokeWidth={isMajor ? 1.5 : 0.5} />
              {isMajor && (
                <text x={lx} y={ly + 3} textAnchor="middle" fill="#333" fontSize={7} fontFamily="monospace">{t}</text>
              )}
            </g>
          );
        })}

        {/* Zone boundary markers */}
        {[SAFE_LIMIT, CAUTION_LIMIT].map(v => {
          const a = angleScale(v);
          const ox = Math.sin(a) * (outerR + 2);
          const oy = -Math.cos(a) * (outerR + 2);
          return (
            <circle key={v} cx={ox} cy={oy} r={1.5}
              fill={v === SAFE_LIMIT ? '#facc15' : '#f43f5e'} opacity={0.5} />
          );
        })}

        {/* Needle */}
        <line x1={0} y1={0} x2={nx} y2={ny}
          stroke={color} strokeWidth={2} strokeLinecap="round"
          filter="url(#gc-needle-glow)"
          style={{ transition: 'all 0.3s ease-out' }} />
        <circle r={5} fill="#111" stroke={color} strokeWidth={1.5}
          style={{ transition: 'stroke 0.3s' }} />
        <circle r={2} fill={color} style={{ transition: 'fill 0.3s' }} />
      </g>

      {/* Center readout */}
      <text x={cx} y={cy - 22} textAnchor="middle" fill={color}
        fontSize={26} fontWeight="bold" fontFamily="monospace"
        style={{ transition: 'fill 0.3s' }}>
        {totalGain}
      </text>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#444"
        fontSize={7} fontFamily="monospace" letterSpacing="1">
        dB TOTAL
      </text>

      {/* Zone label */}
      <text x={cx} y={cy + 14} textAnchor="middle" fill={color}
        fontSize={8} fontWeight="bold" fontFamily="monospace" letterSpacing="2"
        style={{ transition: 'fill 0.3s' }}>
        {zone.label}
      </text>
    </svg>
  );
}

/* ── Power Budget Visualization ────────────────────────────── */

function PowerBudget({ amp }) {
  const maxSafe = amp ? -5 : 10;
  const minDbm = -60, maxDbm = 20;

  const xScale = d3.scaleLinear()
    .domain([minDbm, maxDbm])
    .range([0, 100])
    .clamp(true);

  const thresholdPct = xScale(maxSafe);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-mono font-bold text-base-content/40 tracking-widest uppercase">
          Power Budget — What the front-end sees
        </h4>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-base-content/20">Max safe:</span>
          <span className={`text-xs font-mono font-bold ${amp ? 'text-warning' : 'text-success'}`}
            style={{ transition: 'color 0.3s' }}>
            {maxSafe > 0 ? '+' : ''}{maxSafe} dBm
          </span>
        </div>
      </div>

      {/* Scale */}
      <div className="flex justify-between text-[8px] font-mono text-base-content/15 mb-1 px-0.5">
        <span>{minDbm} dBm</span>
        <span>0</span>
        <span>+{maxDbm} dBm</span>
      </div>

      <div className="space-y-1">
        {SOURCES.map(s => {
          const barPct = xScale(s.dbm);
          const danger = s.dbm > maxSafe;
          const barColor = danger ? '#f43f5e' : '#4ade80';

          return (
            <div key={s.name} className="flex items-center gap-2">
              <span className={`w-32 text-[10px] font-mono truncate transition-colors duration-300 ${danger ? 'text-error/70' : 'text-base-content/30'}`}>
                {s.name}
              </span>

              <div className="flex-1 h-3.5 bg-base-300/40 rounded-sm relative overflow-hidden">
                {/* Danger zone background */}
                <div className="absolute top-0 h-full rounded-r-sm transition-all duration-300"
                  style={{ left: `${thresholdPct}%`, width: `${100 - thresholdPct}%`, background: '#f43f5e06' }} />

                {/* Threshold line with glow */}
                <div className="absolute top-0 h-full w-px z-10 transition-all duration-300"
                  style={{
                    left: `${thresholdPct}%`,
                    background: `linear-gradient(to bottom, transparent, ${amp ? '#facc1560' : '#4ade8040'}, transparent)`,
                    boxShadow: `0 0 6px ${amp ? '#facc1530' : '#4ade8020'}`,
                  }} />

                {/* Signal bar */}
                <div className="h-full rounded-sm transition-all duration-300 ease-out relative"
                  style={{
                    width: `${barPct}%`,
                    background: danger
                      ? 'linear-gradient(90deg, #f43f5e30, #f43f5e70)'
                      : 'linear-gradient(90deg, #4ade8015, #4ade8045)',
                    boxShadow: danger ? `inset 0 0 8px ${barColor}30, 0 0 6px ${barColor}20` : 'none',
                  }}>
                  {/* Tip glow */}
                  <div className="absolute right-0 top-0 h-full w-1 rounded-r-sm"
                    style={{ background: barColor, opacity: danger ? 0.9 : 0.5 }} />
                </div>
              </div>

              <span className={`w-10 text-right text-[10px] font-mono font-bold transition-colors duration-300 ${danger ? 'text-error' : 'text-base-content/25'}`}>
                {s.dbm > 0 ? '+' : ''}{s.dbm}
              </span>

              <span className={`w-14 text-right text-[9px] font-mono font-bold tracking-wider transition-colors duration-300 ${danger ? 'text-error' : 'text-success/40'}`}>
                {danger ? 'DANGER' : 'SAFE'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[9px] font-mono text-base-content/20">
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg, #4ade8020, #4ade8050)' }} /> Below threshold
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg, #f43f5e30, #f43f5e70)' }} /> Exceeds max safe
        </span>
        <span className="flex items-center gap-1">
          <span className="w-px h-3" style={{ background: '#facc1560', boxShadow: '0 0 3px #facc1530' }} /> Threshold
        </span>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */

export default function GainChain({ expanded = false }) {
  const [lna, setLna] = useState(16);
  const [vga, setVga] = useState(20);
  const [amp, setAmp] = useState(false);

  const ampGain = amp ? 14 : 0;
  const totalGain = lna + vga + ampGain;
  const color = dangerColor(totalGain);
  const insight = getInsight(totalGain, amp, lna, vga);

  return (
    <div>
      {/* Signal Chain Flow */}
      <SignalChain lna={lna} vga={vga} amp={amp} totalGain={totalGain} expanded={expanded} />

      {/* Gauge + Controls layout */}
      <div className={`flex ${expanded ? 'flex-row gap-6 items-start' : 'flex-col gap-3'} mt-3`}>

        {/* Arc Gauge */}
        <div className={`flex flex-col items-center ${expanded ? 'w-52 shrink-0' : ''}`}>
          <DangerGauge totalGain={totalGain} expanded={expanded} />

          {/* Insight text below gauge */}
          <p className="text-[10px] text-center leading-relaxed mt-1 px-2 transition-colors duration-300"
            style={{ color: insight.color + '80' }}>
            {insight.text}
          </p>
        </div>

        {/* Gain Controls */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* LNA Slider */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="gc-lna" className="font-mono text-base-content/60">
                LNA <span className="text-base-content/25 text-xs">(IF Gain)</span>
              </label>
              <span className="font-mono font-bold text-info">{lna} dB</span>
            </div>
            <input id="gc-lna" type="range" min={0} max={40} step={8} value={lna}
              onChange={e => setLna(+e.target.value)}
              className="range range-info range-xs w-full" aria-label="LNA gain" />
            <div className="flex justify-between text-[10px] text-base-content/15 font-mono mt-0.5 px-0.5">
              {[0, 8, 16, 24, 32, 40].map(v => <span key={v}>{v}</span>)}
            </div>
          </div>

          {/* VGA Slider */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="gc-vga" className="font-mono text-base-content/60">
                VGA <span className="text-base-content/25 text-xs">(Baseband)</span>
              </label>
              <span className="font-mono font-bold text-secondary">{vga} dB</span>
            </div>
            <input id="gc-vga" type="range" min={0} max={62} step={2} value={vga}
              onChange={e => setVga(+e.target.value)}
              className="range range-secondary range-xs w-full" aria-label="VGA gain" />
            <div className="flex justify-between text-[10px] text-base-content/15 font-mono mt-0.5 px-0.5">
              <span>0</span><span>16</span><span>32</span><span>48</span><span>62</span>
            </div>
          </div>

          {/* AMP Toggle */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300"
            style={{
              background: amp ? '#facc1508' : 'transparent',
              border: `1px solid ${amp ? '#facc1520' : 'transparent'}`,
            }}>
            <label htmlFor="gc-amp" className="font-mono text-sm text-base-content/60">RF Amplifier</label>
            <input id="gc-amp" type="checkbox" className="toggle toggle-warning toggle-sm"
              checked={amp} onChange={e => setAmp(e.target.checked)} aria-label="RF amplifier toggle" />
            <span className={`text-sm font-bold font-mono transition-colors duration-300 ${amp ? 'text-warning' : 'text-base-content/20'}`}>
              {amp ? 'ON (+14 dB)' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Power Budget */}
      <div className="mt-4 pt-4 border-t border-base-content/5">
        <PowerBudget amp={amp} />
      </div>
    </div>
  );
}
