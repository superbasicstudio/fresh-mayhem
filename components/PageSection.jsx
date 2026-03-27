export default function PageSection({ id, title, subtitle, badge, children }) {
  const headerId = `${id}-heading`;
  return (
    <section id={id} className="mb-8 sm:mb-12 pt-2 sm:pt-4" aria-labelledby={headerId}>
      <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
        <h2 id={headerId} className="page-title">{title}</h2>
        {badge}
      </div>
      {subtitle && <p className="text-xs sm:text-sm text-base-content/60 mb-3 sm:mb-5 leading-relaxed">{subtitle}</p>}
      {!subtitle && <div className="mb-3 sm:mb-5" />}
      {children}
    </section>
  );
}
