import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import { vendors, vendorCategories, vendorRegions, buyingTips } from '../../data/vendors';

const severityStyles = {
  tip: { badge: 'badge-primary', label: 'Tip' },
  warning: { badge: 'badge-warning', label: 'Heads Up' },
  info: { badge: 'badge-info', label: 'Info' },
};

export default function WhereToBuyPage() {
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [regionFilter, setRegionFilter] = useState(null);

  const filtered = vendors.filter(v => {
    if (categoryFilter && v.category !== categoryFilter) return false;
    if (regionFilter && v.region !== regionFilter) return false;
    return true;
  });

  return (
    <>
      <PageSection
        id="where-to-buy"
        title="Where to Buy"
        subtitle="Community-referenced sources for HackRF One, PortaPack, and accessories. Not an endorsement — always do your own research."
        icon={null}
      >
        {/* Disclaimer banner */}
        <div className="card bg-base-300/50 border border-warning/20 p-4 mb-6">
          <div className="flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning mb-1">No Affiliation · No Endorsement</p>
              <p className="text-xs text-base-content/50 leading-relaxed">
                Super Basic Studio, LLC / Fresh Mayhem is <strong>not affiliated with, sponsored by, or endorsed by</strong> any vendor listed on this page.
                Inclusion here is based on community mentions in r/hackrf, r/RTLSDR, and other SDR forums — it does not guarantee
                product quality, authenticity, or service. <strong>Always do your own research before purchasing.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-base-content/30 mr-1">TYPE</span>
            <button
              className={`badge ${!categoryFilter ? 'badge-primary' : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`}
              onClick={() => setCategoryFilter(null)}
            >All</button>
            {vendorCategories.map(cat => (
              <button
                key={cat.id}
                className={`badge ${categoryFilter === cat.id ? cat.color : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`}
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
              >{cat.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-base-content/30 mr-1">REGION</span>
            <button
              className={`badge ${!regionFilter ? 'badge-primary' : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`}
              onClick={() => setRegionFilter(null)}
            >All</button>
            {vendorRegions.map(r => (
              <button
                key={r.id}
                className={`badge ${regionFilter === r.id ? 'badge-secondary' : 'badge-ghost'} badge-sm font-mono text-[10px] cursor-pointer`}
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
          <p className="text-sm text-base-content/30 text-center py-8 font-mono">No vendors match the selected filters.</p>
        )}
      </PageSection>

      <PageSection id="buying-tips" title="Tips on Buying" subtitle="Things the community wishes they knew before their first purchase." icon={null}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {buyingTips.map(tip => {
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
