import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { noGoBands, legalBands } from '../../data/frequencyMap';
import { lookupDetails, menuOverviews, hardwareDetails } from '../../data/appDetails';

/* ── Cross-links to relevant pages in the app ── */
const RELATED_LINKS = {
  receive:     [{ to: '/receive', label: 'RX Apps Catalog', desc: 'Full searchable catalog with screenshots' }, { to: '/frequencies', label: 'Frequency Reference', desc: 'Band allocations and spectrum map' }, { to: '/safety', label: 'Safety Center', desc: 'RX is safe, but know the boundaries' }],
  transmit:    [{ to: '/transmit', label: 'TX Apps Catalog', desc: 'Danger ratings and legal guidance' }, { to: '/safety', label: 'Safety Center', desc: 'Damage scenarios and legal risks' }, { to: '/frequencies', label: 'Frequency Reference', desc: 'Know which bands are restricted' }],
  transceiver: [{ to: '/controls', label: 'Device Controls', desc: 'Gain chain and hardware settings' }, { to: '/safety', label: 'Safety Center', desc: 'TX safety and antenna requirements' }],
  main:        [{ to: '/quickstart', label: 'Quick Start Guide', desc: 'Firmware install and first steps' }, { to: '/controls', label: 'Device Controls', desc: 'Hardware interface and gain settings' }, { to: '/learn', label: 'Learn About RF', desc: 'Videos and educational resources' }],
  utilities:   [{ to: '/tools', label: 'Tools Reference', desc: 'Full tools catalog with details' }, { to: '/controls', label: 'Device Controls', desc: 'Hardware settings and gain chain' }],
  tools:       [{ to: '/tools', label: 'Tools Reference', desc: 'Full tools catalog with details' }],
  settings:    [{ to: '/controls', label: 'Device Controls', desc: 'Gain chain and hardware walkthrough' }, { to: '/quickstart', label: 'Quick Start Guide', desc: 'Initial setup and firmware update' }, { to: '/troubleshooting', label: 'Troubleshooting', desc: 'Common issues and fixes' }],
  games:       [{ to: '/tools', label: 'Tools & Games', desc: 'Full catalog of utilities and games' }],
  debug:       [{ to: '/troubleshooting', label: 'Troubleshooting', desc: 'Common issues and diagnostic steps' }, { to: '/controls', label: 'Device Controls', desc: 'Hardware reference' }],
};

/* ── Frequency Position Bar (mini SVG) ─────────────────────────── */

const LOG_MIN = Math.log10(1);      // 1 MHz
const LOG_MAX = Math.log10(6000);   // 6 GHz
const toX = (mhz, w) => ((Math.log10(Math.max(1, mhz)) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * w;

function FreqBar({ frequencies, width = 320 }) {
  const W = width, H = 40, barY = 6, barH = 18;
  if (!frequencies || frequencies.length === 0) return null;

  const ticks = [
    { mhz: 1, label: '1M' }, { mhz: 10, label: '10M' },
    { mhz: 100, label: '100M' }, { mhz: 1000, label: '1G' },
    { mhz: 6000, label: '6G' },
  ];

  // Generate a subtle noise-floor line (deterministic pseudo-random)
  const noisePoints = [];
  for (let i = 0; i <= 64; i++) {
    const x = (i / 64) * W;
    const base = barY + barH * 0.65;
    const noise = Math.sin(i * 7.3 + 2.1) * 2 + Math.sin(i * 13.7) * 1.5;
    noisePoints.push(`${x},${base + noise}`);
  }
  // Add signal peaks at marker positions
  const peakPoints = frequencies.map(f => toX(f, W));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 40 }} role="img" aria-label="Frequency position on RF spectrum">
      <defs>
        <linearGradient id="freqBarBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="markerGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fff00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7fff00" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Bar background */}
      <rect x={0} y={barY} width={W} height={barH} rx={3} fill="url(#freqBarBg)" stroke="#1a1a1a" strokeWidth={0.5} />

      {/* No-go bands */}
      {noGoBands.map((b, i) => {
        const x1 = toX(b.startMHz, W), x2 = toX(b.endMHz, W);
        return <rect key={`ng${i}`} x={x1} y={barY} width={Math.max(1, x2 - x1)} height={barH} fill="#f43f5e" opacity={0.12} />;
      })}

      {/* Legal ISM bands */}
      {legalBands.map((b, i) => {
        const x1 = toX(b.startMHz, W), x2 = toX(b.endMHz, W);
        return <rect key={`lg${i}`} x={x1} y={barY} width={Math.max(1.5, x2 - x1)} height={barH} fill="#4ade80" opacity={0.1} />;
      })}

      {/* Subtle noise floor line */}
      <polyline points={noisePoints.join(' ')} fill="none" stroke="#7fff00" strokeWidth={0.5} opacity={0.15} />

      {/* Frequency markers with glow */}
      {frequencies.map((f, i) => {
        const x = toX(f, W);
        return (
          <g key={i}>
            <rect x={x - 4} y={barY} width={8} height={barH} fill="url(#markerGlow)" opacity={0.3} />
            <line x1={x} y1={barY} x2={x} y2={barY + barH} stroke="#7fff00" strokeWidth={1.5} strokeLinecap="round" />
            <circle cx={x} cy={barY + barH / 2} r={2.5} fill="#7fff00" />
            <circle cx={x} cy={barY + barH / 2} r={5} fill="none" stroke="#7fff00" strokeWidth={0.5} opacity={0.3} />
          </g>
        );
      })}

      {/* Scale ticks and labels */}
      {ticks.map(({ mhz, label }) => {
        const x = toX(mhz, W);
        return (
          <g key={mhz}>
            <line x1={x} y1={barY + barH} x2={x} y2={barY + barH + 3} stroke="#222" strokeWidth={0.5} />
            <text x={x} y={H} textAnchor="middle" fill="#333" fontSize={6} fontFamily="monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Safety Indicator Badge ────────────────────────────────────── */

const SAFETY_STYLES = {
  safe:    { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', label: 'RECEIVE ONLY',         dot: 'bg-success' },
  caution: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'CHECK LOCAL LAWS',     dot: 'bg-warning' },
  danger:  { bg: 'bg-error/10',   text: 'text-error',   border: 'border-error/20',   label: 'HIGH RISK',            dot: 'bg-error' },
  extreme: { bg: 'bg-error/15',   text: 'text-error',   border: 'border-error/30',   label: 'EXTREME RISK',         dot: 'bg-error' },
};

function SafetyPill({ level }) {
  const s = SAFETY_STYLES[level] || SAFETY_STYLES.safe;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ── Gain Recommendation Display ──────────────────────────────── */

function GainRec({ gain }) {
  if (!gain) return null;
  const lnaPct = (gain.lna / 40) * 100;
  const vgaPct = (gain.vga / 62) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-base-content/30 w-8 shrink-0">LNA</span>
        <div className="flex-1 h-1.5 rounded-full bg-base-100/50">
          <div className="h-full rounded-full bg-info/50 transition-all" style={{ width: `${lnaPct}%` }} />
        </div>
        <span className="font-mono text-xs font-bold text-info w-8 text-right">{gain.lna}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-base-content/30 w-8 shrink-0">VGA</span>
        <div className="flex-1 h-1.5 rounded-full bg-base-100/50">
          <div className="h-full rounded-full bg-secondary/50 transition-all" style={{ width: `${vgaPct}%` }} />
        </div>
        <span className="font-mono text-xs font-bold text-secondary w-8 text-right">{gain.vga}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-base-content/30 w-8 shrink-0">AMP</span>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${gain.amp ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-base-100/30 text-base-content/20'}`}>
          {gain.amp ? 'ON (+14 dB)' : 'OFF'}
        </div>
      </div>
    </div>
  );
}

/* ── Section Divider ──────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mt-6 mb-3">
      <span className="text-[9px] font-mono tracking-[0.2em] text-base-content/25 uppercase">{children}</span>
      <div className="flex-1 h-px bg-base-content/5" />
    </div>
  );
}

/* ── Item Detail Panel ────────────────────────────────────────── */

function ItemPanel({ details, item }) {
  const d = details;
  const isExtreme = d.safety === 'extreme';
  const isDanger = d.safety === 'danger' || isExtreme;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display text-sm sm:text-base tracking-wide text-base-content/90 mb-2">{item.label}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <SafetyPill level={d.safety} />
          {d.category && (
            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-base-content/10"
              style={{ color: d.categoryColor || '#888' }}>
              {d.category}
            </span>
          )}
          {d.band && (
            <span className="text-[10px] font-mono text-base-content/30 tracking-wider">{d.band}</span>
          )}
        </div>
      </div>

      {/* Legal warning for extreme/danger TX apps */}
      {isDanger && d.legal && (
        <div className={`rounded-lg p-3 mb-4 border ${isExtreme ? 'bg-error/5 border-error/20' : 'bg-warning/5 border-warning/20'}`}>
          <p className={`text-xs font-mono leading-relaxed ${isExtreme ? 'text-error/80' : 'text-warning/80'}`}>
            {d.legal}
          </p>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-base-content/60 leading-relaxed">{d.description}</p>

      {/* Why dangerous (extreme TX apps) */}
      {d.whyDangerous && (
        <>
          <SectionLabel>Why This Is Dangerous</SectionLabel>
          <ul className="space-y-1.5">
            {d.whyDangerous.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-error/60 leading-relaxed">
                <span className="text-error/40 mt-0.5 shrink-0"> - </span>
                {reason}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Recommendation for extreme apps */}
      {d.recommendation && (
        <div className="mt-3 rounded-lg p-3 bg-error/5 border border-error/10">
          <p className="text-xs font-mono text-error/60">{d.recommendation}</p>
        </div>
      )}

      {/* Frequency section */}
      {d.frequencyDisplay && (
        <>
          <SectionLabel>Frequency</SectionLabel>
          <div className="bg-base-300/40 rounded-lg p-3">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-sm font-bold text-primary">{d.frequencyDisplay}</span>
              {d.protocol && <span className="text-[10px] font-mono text-base-content/30">{d.protocol}</span>}
            </div>
            {d.frequencyMHz && <FreqBar frequencies={d.frequencyMHz} />}
            {d.signalType && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono text-base-content/25 tracking-wider">SIGNAL</span>
                <span className="text-xs text-base-content/50">{d.signalType}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Recommended settings */}
      {(d.gain || d.antenna) && (
        <>
          <SectionLabel>Recommended Settings</SectionLabel>
          <div className="bg-base-300/40 rounded-lg p-3 space-y-2">
            {d.gain && <GainRec gain={d.gain} />}
            {d.antenna && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-base-content/25 tracking-wider">ANTENNA</span>
                <span className="text-xs text-base-content/50">{d.antenna}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tips */}
      {d.tips && d.tips.length > 0 && (
        <>
          <SectionLabel>Tips</SectionLabel>
          <ul className="space-y-1.5">
            {d.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-base-content/50 leading-relaxed">
                <span className="text-primary/30 mt-0.5 shrink-0">›</span>
                {tip}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Did You Know */}
      {d.didYouKnow && (
        <>
          <SectionLabel>Did You Know?</SectionLabel>
          <div className="bg-primary/3 rounded-lg p-3 border border-primary/8">
            <p className="text-xs text-base-content/50 leading-relaxed italic">{d.didYouKnow}</p>
          </div>
        </>
      )}

      {/* Wiki link */}
      {d.wikiUrl && (
        <div className="mt-4">
          <a href={d.wikiUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary/60 hover:text-primary transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Mayhem Wiki
          </a>
        </div>
      )}

      {/* Cross-links based on app type */}
      {d.type === 'rx' && <RelatedLinks menuId="receive" />}
      {(d.type === 'tx' && d.safety !== 'safe') && <RelatedLinks menuId="transmit" />}
    </div>
  );
}

/* ── Basic Panel (no rich details, shows info text with context) ── */

function BasicPanel({ item }) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-display text-sm sm:text-base tracking-wide text-base-content/90">{item.label}</h3>
        {item.external && (
          <span className="text-[10px] font-mono tracking-wider text-base-content/25 mt-1 block">External App (SD Card)</span>
        )}
      </div>

      {item.info && (
        <p className="text-sm text-base-content/50 leading-relaxed">{item.info}</p>
      )}

      {/* Color-coded category hint based on item color */}
      {item.color && (
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-[10px] font-mono text-base-content/25 tracking-wider">
            {item.color === '#00FF00' ? 'Stable' : item.color === '#FFFF00' ? 'Beta' : item.color === '#FFAF00' ? 'Experimental' : item.color === '#FF0000' ? 'Destructive' : item.color === '#00FFFF' ? 'Category' : item.color === '#00BFBF' ? 'Setting' : 'App'}
          </span>
        </div>
      )}

      {item.sub && (
        <div className="rounded-lg p-3 bg-primary/5 border border-primary/10 mt-3">
          <p className="text-xs font-mono text-primary/50">Press Enter to explore this category</p>
        </div>
      )}
    </div>
  );
}

/* ── Related Links Component ──────────────────────────────────── */

function RelatedLinks({ menuId }) {
  const links = RELATED_LINKS[menuId];
  if (!links || links.length === 0) return null;

  return (
    <>
      <SectionLabel>Explore in Fresh Mayhem</SectionLabel>
      <div className="space-y-1.5">
        {links.map(link => (
          <Link key={link.to} to={link.to}
            className="flex items-center gap-3 py-2 px-3 rounded-lg bg-base-300/30 border border-base-content/5 hover:border-primary/20 hover:bg-primary/5 transition-all group">
            <svg className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary/70 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" role="img" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-base-content/60 group-hover:text-primary/80 transition-colors">{link.label}</div>
              <div className="text-[10px] text-base-content/25">{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

/* ── Menu Overview Panel ──────────────────────────────────────── */

function OverviewPanel({ menuId }) {
  const ov = menuOverviews[menuId];
  if (!ov) return <DefaultPanel />;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="mb-4">
        <h3 className="font-display text-sm sm:text-base tracking-wide text-base-content/90">{ov.title}</h3>
        {ov.subtitle && <p className="text-[10px] font-mono tracking-wider text-base-content/25 mt-1">{ov.subtitle}</p>}
      </div>

      {/* Safety pill for menu */}
      {ov.safety && (
        <div className="mb-3">
          <SafetyPill level={ov.safety} />
        </div>
      )}

      {/* Warning */}
      {ov.warning && (
        <div className="rounded-lg p-3 mb-4 bg-error/5 border border-error/15">
          <p className="text-xs font-mono text-error/70 leading-relaxed">{ov.warning}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-base-content/50 leading-relaxed">{ov.description}</p>

      {/* Note */}
      {ov.note && (
        <p className="text-xs text-base-content/30 leading-relaxed mt-2 italic">{ov.note}</p>
      )}

      {/* Stats grid (main menu) */}
      {ov.stats && (
        <>
          <SectionLabel>At a Glance</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            {ov.stats.map(s => (
              <div key={s.label} className="rounded-lg p-3 text-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${s.color}08, ${s.color}03)`, border: `1px solid ${s.color}15` }}>
                <div className="font-mono text-xl sm:text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[9px] font-mono tracking-wider mt-0.5" style={{ color: s.color + '80' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Spectrum coverage bar (main menu) */}
      {menuId === 'main' && (
        <>
          <SectionLabel>Spectrum Coverage</SectionLabel>
          <div className="bg-base-300/30 rounded-lg p-3">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-sm font-bold text-primary">1 MHz  -  6 GHz</span>
              <span className="text-[10px] font-mono text-base-content/25">TX + RX, Half-Duplex</span>
            </div>
            <FreqBar frequencies={[433.92, 915, 1090, 2400, 5800]} />
            <div className="flex items-center gap-3 mt-2 text-[9px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-1 rounded-sm bg-error/30" />No-Go</span>
              <span className="flex items-center gap-1"><span className="w-2 h-1 rounded-sm bg-success/30" />ISM</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Key Freq</span>
            </div>
          </div>
        </>
      )}

      {/* Features list (main menu) */}
      {ov.features && (
        <>
          <SectionLabel>Capabilities</SectionLabel>
          <ul className="space-y-1.5">
            {ov.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-base-content/40 leading-relaxed">
                <span className="text-primary/30 mt-0.5 shrink-0">›</span>
                {f}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Categories (receive menu) */}
      {ov.categories && (
        <>
          <SectionLabel>Categories ({ov.categories.reduce((sum, c) => sum + c.count, 0)} apps)</SectionLabel>
          <div className="space-y-1">
            {ov.categories.map(c => (
              <div key={c.name} className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors"
                style={{ background: `${c.color}06`, border: `1px solid ${c.color}10` }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold" style={{ color: c.color + 'cc' }}>{c.name}</span>
                    <span className="text-[10px] font-mono text-base-content/20">{c.count}</span>
                  </div>
                  <span className="text-[10px] text-base-content/25">{c.apps}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TX breakdown (transmit menu) */}
      {ov.breakdown && (
        <>
          <SectionLabel>Danger Breakdown</SectionLabel>
          <div className="space-y-2">
            {ov.breakdown.map(b => {
              const pct = Math.round((b.count / 22) * 100);
              return (
                <div key={b.level} className="rounded-lg p-2.5" style={{ background: `${b.color}08`, border: `1px solid ${b.color}12` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color: b.color }}>
                      {b.level}
                    </span>
                    <span className="font-mono text-xs font-bold" style={{ color: b.color + '80' }}>{b.count}</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-base-300/50 mb-1.5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.color + '40' }} />
                  </div>
                  <span className="text-[10px] text-base-content/30">{b.desc}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recommendation */}
      {ov.recommendation && (
        <div className="mt-4 rounded-lg p-3 bg-warning/5 border border-warning/10">
          <p className="text-xs font-mono text-warning/60">{ov.recommendation}</p>
        </div>
      )}

      {/* Cross-links to related pages in the app */}
      <RelatedLinks menuId={menuId} />
    </div>
  );
}

/* ── Hardware Zone Panel ──────────────────────────────────────── */

function HardwarePanel({ hwId }) {
  const hw = hardwareDetails[hwId];
  if (!hw) return null;

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-display text-sm tracking-wide" style={{ color: hw.color }}>{hw.title}</h3>
      </div>

      <p className="text-sm text-base-content/60 leading-relaxed">{hw.description}</p>

      {hw.details && (
        <>
          <SectionLabel>Details</SectionLabel>
          <ul className="space-y-1.5">
            {hw.details.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-base-content/50 leading-relaxed">
                <span className="mt-0.5 shrink-0" style={{ color: hw.color + '60' }}>›</span>
                {d}
              </li>
            ))}
          </ul>
        </>
      )}

      {hw.warning && (
        <div className="mt-4 rounded-lg p-3 bg-error/5 border border-error/15">
          <p className="text-xs font-mono text-error/60 leading-relaxed">{hw.warning}</p>
        </div>
      )}
    </div>
  );
}

/* ── Default Panel ────────────────────────────────────────────── */

function DefaultPanel() {
  return (
    <div className="text-center py-8">
      <div className="text-base-content/10 text-4xl mb-3">📡</div>
      <p className="text-xs text-base-content/25 font-mono">Navigate the menu to explore apps</p>
    </div>
  );
}

/* ── Breadcrumb Trail ──────────────────────────────────────────── */

const MENU_LABELS = { main: 'Main', receive: 'Receive', transmit: 'Transmit', transceiver: 'Transceiver', utilities: 'Utilities', tools: 'Tools', settings: 'Settings', games: 'Games', debug: 'Debug' };

function Breadcrumb({ breadcrumb, currentItem }) {
  if (!breadcrumb || breadcrumb.length === 0) return null;
  const parts = breadcrumb.map(id => MENU_LABELS[id] || id);
  if (currentItem) parts.push(currentItem);

  return (
    <div className="flex items-center gap-1 mb-4 pb-3 border-b border-base-content/5">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-base-content/10 text-[10px]">/</span>}
          <span className={`text-[10px] font-mono tracking-wider ${i === parts.length - 1 ? 'text-primary/60' : 'text-base-content/20'}`}>
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ── Main Context Panel Component ─────────────────────────────── */

export default function ContextPanel({ menuId, highlightedItem, activeHardwareId, breadcrumb }) {
  const label = highlightedItem?.label;

  // Determine which content to render
  let content;
  let contentKey;

  if (activeHardwareId && hardwareDetails[activeHardwareId]) {
    content = <HardwarePanel hwId={activeHardwareId} />;
    contentKey = `hw-${activeHardwareId}`;
  } else {
    const details = label ? lookupDetails(menuId, label) : null;

    if (details) {
      // Rich app details panel (apps with full educational info)
      content = <ItemPanel details={details} item={highlightedItem} />;
      contentKey = `item-${menuId}-${label}`;
    } else if (highlightedItem?.sub && menuOverviews[highlightedItem.sub]) {
      // Submenu item highlighted: show the overview for that submenu
      // (e.g. hovering "Transmit" shows the transmit overview with danger breakdown)
      content = <OverviewPanel menuId={highlightedItem.sub} />;
      contentKey = `overview-${highlightedItem.sub}`;
    } else if (label && (highlightedItem?.info || highlightedItem?.sub)) {
      // Item with info text but no rich details
      content = <BasicPanel item={highlightedItem} />;
      contentKey = `basic-${label}`;
    } else if (menuOverviews[menuId]) {
      // No item highlighted or no content: show current menu overview
      content = <OverviewPanel menuId={menuId} />;
      contentKey = `overview-${menuId}`;
    } else {
      content = <DefaultPanel />;
      contentKey = 'default';
    }
  }

  // Smooth fade out → in on content change
  const [fade, setFade] = useState(false);
  const prevKeyRef = useRef(contentKey);
  const timerRef = useRef(null);

  useEffect(() => {
    if (contentKey !== prevKeyRef.current) {
      setFade(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        prevKeyRef.current = contentKey;
        setFade(false);
      }, 100);
    }
    return () => clearTimeout(timerRef.current);
  }, [contentKey]);

  return (
    <div className="flex-1 min-w-0">
      {/* Breadcrumb */}
      {!activeHardwareId && (
        <Breadcrumb breadcrumb={breadcrumb} currentItem={label} />
      )}
      {/* Content with smooth fade transition */}
      <div className={`transition-opacity duration-150 ease-out ${fade ? 'opacity-0' : 'opacity-100'}`}>
        {content}
      </div>
    </div>
  );
}
