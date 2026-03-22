export default function PageSection({ id, title, subtitle, icon: Icon, badge, children }) {
  const headerId = `${id}-heading`;
  return (
    <section id={id} className="mb-8 sm:mb-12 pt-2 sm:pt-4" aria-labelledby={headerId}>
      <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
        {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/30" aria-hidden="true" />}
        <h2 id={headerId} className="font-display text-[11px] sm:text-sm md:text-base tracking-wider text-base-content/90">{title}</h2>
        {badge}
      </div>
      {subtitle && <p className="text-[11px] sm:text-xs text-base-content/40 mb-3 sm:mb-5 ml-6 sm:ml-[30px] leading-relaxed">{subtitle}</p>}
      {!subtitle && <div className="mb-3 sm:mb-5" />}
      {children}
    </section>
  );
}
