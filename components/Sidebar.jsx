import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import HackRFIcon from './HackRFIcon';
import {
  HomeIcon,
  AdjustmentsHorizontalIcon,
  SignalIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  FilmIcon,
  RocketLaunchIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

const sections = [
  { path: '/', label: 'Overview', icon: HomeIcon },
  { path: '/controls', label: 'Controls', icon: AdjustmentsHorizontalIcon },
  { path: '/receive', label: 'Receive Apps', icon: SignalIcon },
  { path: '/transmit', label: 'Transmit Apps', icon: BoltIcon },
  { path: '/tools', label: 'Tools', icon: WrenchScrewdriverIcon },
  { path: '/safety', label: 'Safety Center', icon: ShieldExclamationIcon },
  { path: '/frequencies', label: 'Frequencies', icon: ChartBarIcon },
  { path: '/learn', label: 'Videos / Learning', icon: FilmIcon },
  { path: '/quickstart', label: 'Quick Start', icon: RocketLaunchIcon },
];

const STORAGE_KEY = 'fm-sidebar-collapsed';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch {}
    document.documentElement.dataset.sidebarCollapsed = String(collapsed);
  }, [collapsed]);

  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-base-200 border-r border-base-content/5 z-50 overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-in-out ${collapsed ? 'w-[68px]' : 'w-64'}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`pt-5 pb-4 transition-[padding] duration-300 ${collapsed ? 'px-2' : 'px-4'}`}>
        <NavLink to="/" className="block">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
            <HackRFIcon className="w-7 h-7 text-primary shrink-0" />
            {!collapsed && <h2 className="font-display text-sm text-primary tracking-wider leading-relaxed whitespace-nowrap">FRESH MAYHEM</h2>}
          </div>
          {!collapsed && (
            <>
              <p className="text-[11px] text-primary/60 mt-1.5 font-mono font-medium tracking-wide leading-snug">Mayhem Firmware Guide</p>
              <p className="text-[10px] text-base-content/30 font-mono">PortaPack H4M + HackRF One</p>
            </>
          )}
        </NavLink>
      </div>
      <nav className={`pb-6 flex-1 transition-[padding] duration-300 ${collapsed ? 'px-1.5' : 'px-3'}`}>
        <ul className="flex flex-col gap-0.5">
          {sections.map(s => (
            <li key={s.path} className="relative group">
              <NavLink
                to={s.path}
                end={s.path === '/'}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2'} rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60'
                  }`
                }
              >
                <s.icon className="w-[18px] h-[18px] shrink-0 opacity-60" />
                {!collapsed && <span className="font-medium whitespace-nowrap">{s.label}</span>}
              </NavLink>
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-base-300 text-xs font-medium text-base-content whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-[60] shadow-lg">
                  {s.label}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={() => setCollapsed(c => !c)}
        className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-base-300 hover:bg-base-content/20 text-base-content/50 hover:text-base-content transition-colors mx-auto mb-4 shrink-0"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeftIcon className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
}
