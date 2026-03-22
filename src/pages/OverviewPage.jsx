import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AdjustmentsHorizontalIcon,
  SignalIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import HeroHeader from '../../components/HeroHeader';
import { rxApps } from '../../data/rxApps';
import { txApps } from '../../data/txApps';
import { tools, games } from '../../data/tools';
import { quickStartSteps } from '../../components/QuickStartStep';

const pages = [
  { path: '/controls', label: 'Controls & Navigation', icon: AdjustmentsHorizontalIcon, stat: 'Interactive simulators', statColor: 'text-primary', desc: 'PortaPack mockup, waterfall display, gain chain calculator', img: '/screenshots/main-menu.png' },
  { path: '/receive', label: 'Receive Apps', icon: SignalIcon, stat: `${rxApps.length} apps`, statColor: 'text-primary', desc: 'Passive reconnaissance — ADS-B, POCSAG, SubGhzD, BLE, and more', img: '/screenshots/adsb.png' },
  { path: '/transmit', label: 'Transmit Apps', icon: BoltIcon, stat: `${txApps.length} apps`, statColor: 'text-error', desc: 'Active testing — OOK, replay, FlipperTX, BLE TX (authorized use only)', img: '/screenshots/ook-tx.png' },
  { path: '/tools', label: 'Tools & Settings', icon: WrenchScrewdriverIcon, stat: `${tools.length} tools, ${games.length} games`, statColor: 'text-primary', desc: 'Freq manager, signal gen, file manager, app manager, and more', img: '/screenshots/app-manager.png' },
  { path: '/safety', label: 'Safety Center', icon: ShieldExclamationIcon, stat: 'Damage prevention', statColor: 'text-error', desc: 'Beginner mistakes, damage stories, TX danger ratings, amp insight', img: '/screenshots/amp-comparison.png' },
  { path: '/frequencies', label: 'Frequency Reference', icon: ChartBarIcon, stat: '1 MHz – 6 GHz', statColor: 'text-primary', desc: 'RF spectrum chart, no-go frequencies, legal TX bands, penalties', img: '/screenshots/full-spectrum.png' },
  { path: '/learn', label: 'Learn & Resources', icon: AcademicCapIcon, stat: 'Videos & links', statColor: 'text-primary', desc: 'Setup tutorials, app demos, SDR courses, community resources', img: '/screenshots/fm-broadcast.png' },
  { path: '/quickstart', label: 'Quick Start', icon: RocketLaunchIcon, stat: null, statColor: 'text-primary', desc: 'Step-by-step first receive session walkthrough', img: '/screenshots/looking-glass.png' },
];

export default function OverviewPage() {
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

  return (
    <>
      <HeroHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {pages.map(p => (
          <Link key={p.path} to={p.path} className="card bg-base-200 border border-base-content/10 hover:border-base-content/20 hover:bg-base-300 transition-colors group overflow-hidden flex-row sm:flex-col">
            {p.img && (
              <div className="w-24 sm:w-full h-auto sm:h-28 overflow-hidden shrink-0">
                <img src={p.img} alt="" className="w-full h-full object-cover object-center opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
              </div>
            )}
            <div className="p-3 sm:p-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-2">
                <p.icon className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/40 shrink-0" />
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
