import { useState } from 'react';
import { TbBroadcast } from 'react-icons/tb';
import PageSection from '../../components/PageSection';
import { TxAppCard } from '../../components/AppCard';
import SearchFilter from '../../components/SearchFilter';
import DangerDonut from '../../components/charts/DangerDonut';
import { txApps } from '../../data/txApps';

export default function TransmitPage() {
  const [txFilter, setTxFilter] = useState('');
  const [dangerFilter, setDangerFilter] = useState(null);

  const filteredTx = txApps.filter(a => {
    const matchesText = !txFilter || a.name.toLowerCase().includes(txFilter.toLowerCase()) || a.description.toLowerCase().includes(txFilter.toLowerCase());
    const matchesDanger = !dangerFilter || a.danger === dangerFilter;
    return matchesText && matchesDanger;
  });

  return (
    <PageSection id="tx-apps" title="Transmit Apps" subtitle="All 22 transmit applications in Mayhem firmware. Each rated by danger level — always use a dummy load or matched antenna." icon={TbBroadcast}>
      <p className="text-xs text-base-content/40 mb-4 leading-relaxed pl-3">
        All TX apps require an antenna or dummy load. Never TX without a load connected. Hide Jammer, GPS Sim, and ADS-B TX via App Manager.
      </p>

      <DangerDonut onFilterDanger={setDangerFilter} activeFilter={dangerFilter} />

      <div className="mb-3 mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <SearchFilter value={txFilter} onChange={setTxFilter} placeholder="Filter transmit apps..." aria-label="Filter transmit apps" />
        <span className="text-xs text-base-content/40 font-mono">{filteredTx.length} apps</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTx.map(app => <TxAppCard key={app.name} app={app} />)}
      </div>
    </PageSection>
  );
}
