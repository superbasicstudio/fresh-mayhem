import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const STORAGE_KEY = 'fm-sidebar-collapsed';

export default function DashboardLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    const onStorage = () => {
      try { setCollapsed(localStorage.getItem(STORAGE_KEY) === 'true'); } catch {}
    };
    window.addEventListener('storage', onStorage);
    const observer = new MutationObserver(() => {
      setCollapsed(document.documentElement.dataset.sidebarCollapsed === 'true');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sidebar-collapsed'] });
    return () => { window.removeEventListener('storage', onStorage); observer.disconnect(); };
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main
        id="main-content"
        role="main"
        className={`flex-1 p-6 max-w-6xl mx-auto transition-[margin-left] duration-300 ease-in-out ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-64'}`}
      >
        <Outlet />
        <footer className="text-center text-xs text-base-content/20 py-8 font-mono tracking-wide">
          Fresh Mayhem <span className="text-base-content/10 mx-1">/</span> Mayhem Firmware <span className="text-base-content/10 mx-1">/</span> PortaPack H4M + HackRF One
          <p className="mt-2 text-base-content/15">Educational resource — always comply with local RF regulations.</p>
          <p className="mt-3 text-base-content/25 text-[10px] max-w-xl mx-auto leading-relaxed">HackRF and PortaPack are trademarks of their respective owners. Mayhem firmware is an open-source project by its contributors. This site is an independent, unofficial reference and is not affiliated with, endorsed by, or sponsored by <a href="https://greatscottgadgets.com/" target="_blank" rel="noopener noreferrer" className="text-base-content/40 hover:text-primary transition-colors underline underline-offset-2">Great Scott Gadgets</a>, PortaPack, or the Mayhem project.</p>
          <p className="mt-3 text-base-content/20 text-[10px]">A <a href="https://superbasic.studio/projects" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 transition-colors underline underline-offset-2">Super Basic Studio</a> open-source project</p>
        </footer>
      </main>
    </div>
  );
}
