const badges = {
  safe: { label: 'RX ONLY', cls: 'badge-success !text-black', title: 'Receive only — no transmission. Legality of listening varies by region.' },
  caution: { label: 'CAUTION', cls: 'badge-warning !text-black', title: 'Use with caution — check local regulations' },
  danger: { label: 'DANGER', cls: 'badge-error !text-black', title: 'Dangerous — may cause harm or legal issues' },
  extreme: { label: 'EXTREME', cls: 'badge-error bg-error/20 border-error !text-error', title: 'Extreme risk — likely illegal in most jurisdictions' },
  illegal: { label: 'ILLEGAL', cls: 'badge-error !text-black', title: 'Illegal in most jurisdictions' },
};

export default function SafetyBadge({ level }) {
  const b = badges[level] || badges.safe;
  return <span className={`badge ${b.cls} badge-sm font-bold tracking-wider font-mono text-[10px] cursor-help`} title={b.title}>{b.label}</span>;
}
