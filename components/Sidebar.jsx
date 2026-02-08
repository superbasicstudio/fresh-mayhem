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
  AcademicCapIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const sections = [
  { path: '/', label: 'Overview', icon: HomeIcon },
  { path: '/controls', label: 'Controls', icon: AdjustmentsHorizontalIcon },
  { path: '/receive', label: 'Receive Apps', icon: SignalIcon },
  { path: '/transmit', label: 'Transmit Apps', icon: BoltIcon },
  { path: '/tools', label: 'Tools', icon: WrenchScrewdriverIcon },
  { path: '/safety', label: 'Safety Center', icon: ShieldExclamationIcon },
  { path: '/frequencies', label: 'Frequencies', icon: ChartBarIcon },
  { path: '/learn', label: 'Learn', icon: AcademicCapIcon },
  { path: '/quickstart', label: 'Quick Start', icon: RocketLaunchIcon },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-56 bg-base-200 border-r border-base-content/5 z-50 overflow-y-auto" role="navigation" aria-label="Main navigation">
      <div className="px-4 pt-5 pb-4">
        <NavLink to="/" className="block">
          <div className="flex items-center gap-2">
            <HackRFIcon className="w-7 h-7 text-primary" />
            <h2 className="font-display text-sm text-primary tracking-wider leading-relaxed">FRESH MAYHEM</h2>
          </div>
          <p className="text-[11px] text-primary/60 mt-1.5 font-mono font-medium tracking-wide leading-snug">Mayhem Firmware Guide</p>
          <p className="text-[10px] text-base-content/30 font-mono">PortaPack H4M + HackRF One</p>
        </NavLink>
      </div>
      <nav className="px-3 pb-6">
        <ul className="flex flex-col gap-0.5">
          {sections.map(s => (
            <li key={s.path}>
              <NavLink
                to={s.path}
                end={s.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60'
                  }`
                }
              >
                <s.icon className="w-[18px] h-[18px] shrink-0 opacity-60" />
                <span className="font-medium">{s.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
