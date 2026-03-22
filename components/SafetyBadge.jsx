const badges = {
  safe: { label: 'RX ONLY', cls: 'fm-badge-safe', title: 'Receive only — no transmission. Legality of listening varies by region.' },
  caution: { label: 'CAUTION', cls: 'fm-badge-caution', title: 'Use with caution — check local regulations' },
  danger: { label: 'DANGER', cls: 'fm-badge-danger', title: 'Dangerous — may cause harm or legal issues' },
  extreme: { label: 'EXTREME', cls: 'fm-badge-extreme', title: 'Extreme risk — likely illegal in most jurisdictions' },
  illegal: { label: 'ILLEGAL', cls: 'fm-badge-danger', title: 'Illegal in most jurisdictions' },
};

export default function SafetyBadge({ level }) {
  const b = badges[level] || badges.safe;
  return <span className={`${b.cls} cursor-help`} title={b.title}>{b.label}</span>;
}
