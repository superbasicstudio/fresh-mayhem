import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import { vendors, vendorCategories, vendorRegions, buyingTips } from '../../data/vendors';
import { useTranslatedVendors, useTranslatedBuyingTips } from '../useTranslatedData';

export default function WhereToBuyPage() {
  const { t } = useTranslation();
  const translatedVendors = useTranslatedVendors(vendors);
  const translatedTips = useTranslatedBuyingTips(buyingTips);

  const severityStyles = {
    tip: { badge: 'badge-primary', label: t('whereToBuy.tipLabel') },
    warning: { badge: 'badge-warning', label: t('whereToBuy.headsUpLabel') },
    info: { badge: 'badge-info', label: t('whereToBuy.infoLabel') },
  };
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [regionFilter, setRegionFilter] = useState(null);

  const filtered = translatedVendors.filter(v => {
    if (categoryFilter && v.category !== categoryFilter) return false;
    if (regionFilter && v.region !== regionFilter) return false;
    return true;
  });

  return (
    <>
      <PageSection
        id="where-to-buy"
        title={t('whereToBuy.title')}
        subtitle={t('whereToBuy.subtitle')}
        icon={null}
      >
        {/* Disclaimer banner */}
        <div className="card bg-base-300/50 border border-warning/20 p-4 mb-6">
          <div className="flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning mb-1">{t('whereToBuy.disclaimerTitle')}</p>
              <p className="text-xs text-base-content/50 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('whereToBuy.disclaimerText') }} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-base-content/30 mr-1">{t('whereToBuy.typeLabel')}</span>
            <button
              className={`badge badge-sm font-mono text-[10px] cursor-pointer ${!categoryFilter ? 'bg-primary text-primary-content' : 'badge-ghost'}`}
              onClick={() => setCategoryFilter(null)}
            >{t('whereToBuy.all')}</button>
            {vendorCategories.map(cat => (
              <button
                key={cat.id}
                className={`badge badge-sm font-mono text-[10px] cursor-pointer ${categoryFilter === cat.id ? 'bg-primary text-primary-content' : 'badge-ghost'}`}
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
              >{cat.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-base-content/30 mr-1">{t('whereToBuy.regionLabel')}</span>
            <button
              className={`badge badge-sm font-mono text-[10px] cursor-pointer ${!regionFilter ? 'bg-primary text-primary-content' : 'badge-ghost'}`}
              onClick={() => setRegionFilter(null)}
            >{t('whereToBuy.all')}</button>
            {vendorRegions.map(r => (
              <button
                key={r.id}
                className={`badge badge-sm font-mono text-[10px] cursor-pointer ${regionFilter === r.id ? 'bg-primary text-primary-content' : 'badge-ghost'}`}
                onClick={() => setRegionFilter(regionFilter === r.id ? null : r.id)}
              >{r.flag} {r.label}</button>
            ))}
          </div>
        </div>

        {/* Vendor cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(v => {
            const cat = vendorCategories.find(c => c.id === v.category);
            const region = vendorRegions.find(r => r.id === v.region);
            return (
              <a
                key={v.name}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="vendor-click"
                data-umami-event-vendor={v.name}
                data-umami-event-category={v.category}
                data-umami-event-region={v.region}
                className="card bg-base-200 p-4 hover:bg-base-300 transition-colors border border-transparent hover:border-base-content/10"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-semibold link link-primary">{v.name}</h4>
                  {region && <span className="text-xs shrink-0" title={region.label}>{region.flag}</span>}
                </div>
                <p className="text-xs text-base-content/50 leading-relaxed mb-2">{v.description}</p>
                {v.note && (
                  <p className="text-[11px] text-warning/70 leading-relaxed mb-2 italic">{v.note}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {cat && <span className={`badge ${cat.color} badge-sm font-mono text-[10px]`}>{cat.label}</span>}
                  {v.products.map(p => (
                    <span key={p} className="badge badge-ghost badge-sm font-mono text-[10px]">{p}</span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-base-content/30 text-center py-8 font-mono">{t('whereToBuy.noResults')}</p>
        )}
      </PageSection>

      <PageSection id="buying-tips" title={t('whereToBuy.tipsTitle')} subtitle={t('whereToBuy.tipsSubtitle')} icon={null}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {translatedTips.map(tip => {
            const style = severityStyles[tip.severity] || severityStyles.info;
            return (
              <div key={tip.title} className="card bg-base-200 p-4">
                <div className="flex items-start gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-base-content/90 min-w-0">{tip.title}</h4>
                  <span className={`badge ${style.badge} badge-xs font-mono text-[9px] font-bold shrink-0 mt-0.5`}>{style.label}</span>
                </div>
                <p className="text-xs text-base-content/50 leading-relaxed">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </PageSection>
    </>
  );
}
