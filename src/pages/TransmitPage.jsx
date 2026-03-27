import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbBroadcast } from 'react-icons/tb';
import PageSection from '../../components/PageSection';
import { TxAppCard } from '../../components/AppCard';
import SearchFilter from '../../components/SearchFilter';
import DangerDonut from '../../components/charts/DangerDonut';
import { txApps } from '../../data/txApps';
import { useTranslatedApps } from '../useTranslatedData';

export default function TransmitPage() {
  const { t } = useTranslation();
  const translatedApps = useTranslatedApps(txApps, 'txApps');
  const [txFilter, setTxFilter] = useState('');
  const [dangerFilter, setDangerFilter] = useState(null);

  const filteredTx = translatedApps.filter(a => {
    const matchesText = !txFilter || a.name.toLowerCase().includes(txFilter.toLowerCase()) || a.description.toLowerCase().includes(txFilter.toLowerCase());
    const matchesDanger = !dangerFilter || a.danger === dangerFilter;
    return matchesText && matchesDanger;
  });

  return (
    <PageSection id="tx-apps" title={t('transmit.title')} subtitle={t('transmit.subtitle', { count: txApps.length })} icon={TbBroadcast}>
      <p className="text-xs sm:text-sm text-base-content/60 mb-4 leading-relaxed">
        {t('transmit.warning')}
      </p>

      <DangerDonut onFilterDanger={setDangerFilter} activeFilter={dangerFilter} />

      <div className="mb-3 mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <SearchFilter value={txFilter} onChange={setTxFilter} placeholder={t('transmit.filterPlaceholder')} aria-label="Filter transmit apps" />
        <span className="text-xs text-base-content/40 font-mono">{filteredTx.length} {t('common.apps')}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTx.map(app => <TxAppCard key={app.name} app={app} />)}
      </div>
    </PageSection>
  );
}
