import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { TbDeviceGamepad, TbAntenna, TbBroadcast, TbWaveSine, TbBook, TbShoppingCart } from 'react-icons/tb';
import HeroHeader from '../../components/HeroHeader';
import { rxApps } from '../../data/rxApps';
import { txApps } from '../../data/txApps';
import { tools, games } from '../../data/tools';
import { vendors } from '../../data/vendors';
import { quickStartSteps } from '../../components/QuickStartStep';

export default function OverviewPage() {
  const { t } = useTranslation();
  const [qsProgress, setQsProgress] = useState(0);

  useEffect(() => {
    try {
      let completed = 0;
      for (let i = 0; i < quickStartSteps.length; i++) {
        if (localStorage.getItem(`qs-step-${i}`) === 'true') completed++;
      }
      setQsProgress(completed);
    } catch {}
  }, []);

  const pages = [
    { path: '/controls', label: t('overview.cards.controls.label'), icon: TbDeviceGamepad, stat: t('overview.cards.controls.stat'), statColor: 'text-white', desc: t('overview.cards.controls.desc'), img: '/screenshots/main-menu.png' },
    { path: '/receive', label: t('overview.cards.receive.label'), icon: TbAntenna, stat: `${rxApps.length} ${t('common.apps')}`, statColor: 'text-white', desc: t('overview.cards.receive.desc'), img: '/screenshots/adsb.png' },
    { path: '/transmit', label: t('overview.cards.transmit.label'), icon: TbBroadcast, stat: `${txApps.length} ${t('common.apps')}`, statColor: 'text-white', desc: t('overview.cards.transmit.desc'), img: '/screenshots/ook-tx.png' },
    { path: '/tools', label: t('overview.cards.tools.label'), icon: WrenchScrewdriverIcon, stat: `${tools.length} tools, ${games.length} games`, statColor: 'text-white', desc: t('overview.cards.tools.desc'), img: '/screenshots/app-manager.png' },
    { path: '/safety', label: t('overview.cards.safety.label'), icon: ShieldExclamationIcon, stat: t('overview.cards.safety.stat'), statColor: 'text-white', desc: t('overview.cards.safety.desc'), img: '/screenshots/amp-comparison.png' },
    { path: '/frequencies', label: t('overview.cards.frequencies.label'), icon: TbWaveSine, stat: t('overview.cards.frequencies.stat'), statColor: 'text-white', desc: t('overview.cards.frequencies.desc'), img: '/screenshots/full-spectrum.png' },
    { path: '/learn', label: t('overview.cards.learn.label'), icon: TbBook, stat: t('overview.cards.learn.stat'), statColor: 'text-white', desc: t('overview.cards.learn.desc'), img: '/screenshots/fm-broadcast.png' },
    { path: '/quickstart', label: t('overview.cards.quickstart.label'), icon: RocketLaunchIcon, stat: null, statColor: 'text-white', desc: t('overview.cards.quickstart.desc'), img: '/screenshots/looking-glass.png' },
    { path: '/where-to-buy', label: t('overview.cards.whereToBuy.label'), icon: TbShoppingCart, stat: `${vendors.length} ${t('common.vendors')}`, statColor: 'text-white', desc: t('overview.cards.whereToBuy.desc'), img: null },
  ];

  return (
    <>
      <HeroHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {pages.map(p => (
          <Link key={p.path} to={p.path} className="card bg-base-200 border border-base-content/10 hover:border-base-content/20 hover:bg-base-300 transition-colors group overflow-hidden flex-row sm:flex-col">
            {p.img && (
              <div className="w-24 sm:w-full h-auto sm:h-28 overflow-hidden shrink-0">
                <img src={p.img} alt="" className="w-full h-full object-cover object-center opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-300" loading="lazy" />
              </div>
            )}
            <div className="p-3 sm:p-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-2">
                <span className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/40 shrink-0 flex items-center justify-center"><p.icon className="w-full h-full" /></span>
                <h3 className="text-xs sm:text-sm font-semibold text-base-content/90 group-hover:text-base-content truncate">{p.label}</h3>
              </div>
              <p className="text-[11px] sm:text-xs text-base-content/50 leading-relaxed mb-1.5 sm:mb-2 line-clamp-2">{p.desc}</p>
              {p.path === '/quickstart' ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-base-300 rounded-full h-1.5">
                    <div className="bg-accent rounded-full h-1.5 transition-all" style={{ width: `${(qsProgress / quickStartSteps.length) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-accent">{qsProgress}/{quickStartSteps.length}</span>
                </div>
              ) : (
                <span className={`text-xs font-mono ${p.statColor}`}>{p.stat}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
