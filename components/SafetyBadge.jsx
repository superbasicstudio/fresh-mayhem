const badges = {
  safe: { label: 'RX', cls: 'fm-badge-safe', title: 'Receive only — no transmission. Legality of listening varies by region.' },
  caution: { label: 'CAUTION', cls: 'fm-badge-caution', title: 'Use with caution — check local regulations' },
  danger: { label: 'DANGER', cls: 'fm-badge-danger', title: 'Dangerous — may cause harm or legal issues. Check local regulations.' },
  extreme: { label: 'EXTREME', cls: 'fm-badge-extreme', title: 'Extreme risk — likely illegal in most jurisdictions. Not legal advice.' },
  illegal: { label: 'ILLEGAL', cls: 'fm-badge-danger', title: 'Illegal in most known jurisdictions. Verify your local laws.' },
};

export default function SafetyBadge({ level }) {
  const b = badges[level] || badges.safe;
  return <span className={`${b.cls} cursor-help`} title={b.title}>{b.label}</span>;
}
