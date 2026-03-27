import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbAntenna } from 'react-icons/tb';
import PageSection from '../../components/PageSection';
import { RxAppCard } from '../../components/AppCard';
import SafetyBadge from '../../components/SafetyBadge';
import SearchFilter from '../../components/SearchFilter';
import CategoryBreakdown from '../../components/charts/CategoryBreakdown';
import { rxApps } from '../../data/rxApps';
import { useTranslatedApps } from '../useTranslatedData';

export default function ReceivePage() {
  const { t } = useTranslation();
  const translatedApps = useTranslatedApps(rxApps, 'rxApps');
  const [rxFilter, setRxFilter] = useState('');
  const [rxCategory, setRxCategory] = useState(null);

  const filteredRx = translatedApps.filter(a => {
    const matchesText = !rxFilter || a.name.toLowerCase().includes(rxFilter.toLowerCase()) || a.description.toLowerCase().includes(rxFilter.toLowerCase());
    const matchesCat = !rxCategory || a.category === rxCategory;
    return matchesText && matchesCat;
  });

  return (
    <PageSection id="rx-apps" title={t('receive.title')} subtitle={t('receive.subtitle', { count: rxApps.length })} icon={TbAntenna} badge={<SafetyBadge level="safe" />}>
      <CategoryBreakdown onFilterCategory={setRxCategory} activeCategory={rxCategory} />
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <SearchFilter value={rxFilter} onChange={setRxFilter} placeholder={t('receive.filterPlaceholder')} aria-label="Filter receive apps" />
        <span className="text-xs text-base-content/40 font-mono">{filteredRx.length} {t('common.apps')}</span>
        {rxCategory && <span className="badge badge-info badge-sm font-mono text-[10px] !text-black">{rxCategory} <button className="ml-1" onClick={() => setRxCategory(null)} aria-label={`Clear ${rxCategory} filter`}>x</button></span>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredRx.map(app => <RxAppCard key={app.name} app={app} />)}
      </div>
    </PageSection>
  );
}
