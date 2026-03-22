import { useState } from 'react';
import { SignalIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import { RxAppCard } from '../../components/AppCard';
import SafetyBadge from '../../components/SafetyBadge';
import SearchFilter from '../../components/SearchFilter';
import CategoryBreakdown from '../../components/charts/CategoryBreakdown';
import { rxApps } from '../../data/rxApps';

export default function ReceivePage() {
  const [rxFilter, setRxFilter] = useState('');
  const [rxCategory, setRxCategory] = useState(null);

  const filteredRx = rxApps.filter(a => {
    const matchesText = !rxFilter || a.name.toLowerCase().includes(rxFilter.toLowerCase()) || a.description.toLowerCase().includes(rxFilter.toLowerCase());
    const matchesCat = !rxCategory || a.category === rxCategory;
    return matchesText && matchesCat;
  });

  return (
    <PageSection id="rx-apps" title="Receive Apps" subtitle="All 29 receive-only applications in Mayhem firmware. No transmission involved — legality of passive reception varies by region. Always check local laws." icon={SignalIcon} badge={<SafetyBadge level="safe" />}>
      <CategoryBreakdown onFilterCategory={setRxCategory} activeCategory={rxCategory} />
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <SearchFilter value={rxFilter} onChange={setRxFilter} placeholder="Filter receive apps..." aria-label="Filter receive apps" />
        <span className="text-xs text-base-content/40 font-mono">{filteredRx.length} apps</span>
        {rxCategory && <span className="badge badge-info badge-sm font-mono text-[10px] !text-black">{rxCategory} <button className="ml-1" onClick={() => setRxCategory(null)} aria-label={`Clear ${rxCategory} filter`}>x</button></span>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredRx.map(app => <RxAppCard key={app.name} app={app} />)}
      </div>
    </PageSection>
  );
}
