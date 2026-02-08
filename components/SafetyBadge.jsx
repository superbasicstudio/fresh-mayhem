const badges = {
  safe: { label: 'SAFE', cls: 'badge-success !text-black' },
  caution: { label: 'CAUTION', cls: 'badge-warning !text-black' },
  danger: { label: 'DANGER', cls: 'badge-error !text-black' },
  extreme: { label: 'EXTREME', cls: 'badge-error bg-error/20 border-error !text-error' },
  illegal: { label: 'ILLEGAL', cls: 'badge-error !text-black' },
};

export default function SafetyBadge({ level }) {
  const b = badges[level] || badges.safe;
  return <span className={`badge ${b.cls} badge-sm font-bold tracking-wider font-mono text-[10px]`}>{b.label}</span>;
}
