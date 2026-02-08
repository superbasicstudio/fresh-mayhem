export default function PageSection({ id, title, subtitle, icon: Icon, badge, children }) {
  const headerId = `${id}-heading`;
  return (
    <section id={id} className="mb-12 pt-4" aria-labelledby={headerId}>
      <div className="flex items-center gap-2.5 mb-2">
        {Icon && <Icon className="w-5 h-5 text-base-content/30" aria-hidden="true" />}
        <h2 id={headerId} className="font-display text-sm sm:text-base tracking-wider text-base-content/90">{title}</h2>
        {badge}
      </div>
      {subtitle && <p className="text-xs text-base-content/40 mb-5 ml-[30px] leading-relaxed">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </section>
  );
}
