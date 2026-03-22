import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import HackRFIcon from './HackRFIcon';
import {
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  RocketLaunchIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { TbRadar, TbDeviceGamepad, TbAntenna, TbBroadcast, TbWaveSine, TbBook } from 'react-icons/tb';

const sections = [
  { path: '/', label: 'Overview', icon: TbRadar },
  { path: '/controls', label: 'Controls', icon: TbDeviceGamepad },
  { path: '/receive', label: 'Receive (RX) Apps', icon: TbAntenna },
  { path: '/transmit', label: 'Transmit (TX) Apps', icon: TbBroadcast },
  { path: '/tools', label: 'Tools', icon: WrenchScrewdriverIcon },
  { path: '/safety', label: 'Safety Center', icon: ShieldExclamationIcon },
  { path: '/frequencies', label: 'Frequencies', icon: TbWaveSine },
  { path: '/learn', label: 'Videos / Learning', icon: TbBook },
  { path: '/quickstart', label: 'Quick Start', icon: RocketLaunchIcon },
];

const STORAGE_KEY = 'fm-sidebar-collapsed';

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch {}
    document.documentElement.dataset.sidebarCollapsed = String(collapsed);
  }, [collapsed]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const navLinks = (isMobile) => (
    <ul className="flex flex-col gap-0.5">
      {sections.map(s => (
        <li key={s.path} className="relative group">
          <NavLink
            to={s.path}
            end={s.path === '/'}
            className={({ isActive }) =>
              `flex items-center ${!isMobile && collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5'} rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10 border border-primary/30'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60 border border-transparent'
              }`
            }
          >
            <span className="w-[18px] h-[18px] shrink-0 opacity-60 flex items-center justify-center"><s.icon className="w-full h-full" /></span>
            {(isMobile || !collapsed) && <span className="font-medium whitespace-nowrap">{s.label}</span>}
          </NavLink>
          {!isMobile && collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-base-300 text-xs font-medium text-base-content whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-[60] shadow-lg">
              {s.label}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-base-200/95 backdrop-blur-sm border-b border-base-content/5 px-3 py-2.5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <HackRFIcon className="w-6 h-6 text-primary shrink-0" />
          <span className="font-display text-xs text-primary tracking-wider">FRESH MAYHEM</span>
        </NavLink>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="btn btn-ghost btn-sm btn-square"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-screen w-72 bg-base-200 border-l border-base-content/5 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="pt-16 px-3 pb-6">
          <p className="text-[10px] text-base-content/30 font-mono px-3 mb-3">NAVIGATION</p>
          {navLinks(true)}
        </div>
        <div className="px-6 pb-6 border-t border-base-content/5 pt-4">
          <p className="text-[10px] text-primary/60 font-mono font-medium">Mayhem Firmware Guide</p>
          <p className="text-[9px] text-base-content/30 font-mono mt-0.5">PortaPack H4M + HackRF One</p>
        </div>
      </aside>

      {/* Desktop sidebar */}
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
          {navLinks(false)}
        </nav>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-base-300 hover:bg-base-content/20 text-base-content/50 hover:text-base-content transition-colors mx-auto mb-4 shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeftIcon className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>
    </>
  );
}
