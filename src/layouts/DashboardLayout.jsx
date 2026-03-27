import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/Sidebar';
import CommandPalette from '../../components/CommandPalette';

const STORAGE_KEY = 'fm-sidebar-collapsed';

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });

  const [paletteOpen, setPaletteOpen] = useState(false);

  // Ctrl+K / Cmd+K to open command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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

  // Format date in current locale
  const buildDate = new Date(__BUILD_TIME__).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex min-h-screen pb-8">
      <Sidebar onSearchClick={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <main
        id="main-content"
        role="main"
        className={`flex-1 px-3 py-4 pt-14 sm:px-4 sm:py-5 sm:pt-16 lg:p-6 lg:pt-6 max-w-6xl mx-auto transition-[margin-left] duration-300 ease-in-out ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-64'}`}
      >
        <Outlet />
        <footer className="text-center text-[10px] sm:text-xs text-base-content/20 py-6 sm:py-8 font-mono tracking-wide">
          {t('footer.freshMayhem')} <span className="text-base-content/10 mx-1">/</span> {t('footer.mayhemFirmware')} <span className="text-base-content/10 mx-1">/</span> {t('footer.portapackHackrf')}
          <p className="mt-2 text-base-content/15">{t('footer.educationalOnly')}</p>
          <p className="mt-3 text-base-content/25 text-[10px] max-w-xl mx-auto leading-relaxed">{t('footer.trademarkNotice')} <a href="https://greatscottgadgets.com/" target="_blank" rel="noopener noreferrer" className="text-base-content/40 hover:text-primary transition-colors underline underline-offset-2">{t('footer.greatScottGadgets')}</a>{t('footer.trademarkSuffix')}</p>
        </footer>
      </main>
      {/* Sticky bottom bar */}
      <div className={`fixed bottom-0 right-0 z-40 bg-base-200/90 backdrop-blur-sm border-t border-base-content/5 py-1.5 text-center left-0 transition-[left] duration-300 ease-in-out ${collapsed ? 'lg:left-[68px]' : 'lg:left-64'}`}>
        <p className="text-[10px] text-base-content/25 font-mono">A <a href="https://superbasic.studio/projects" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 transition-colors underline underline-offset-2">Super Basic Studio</a> open-source project <span className="text-base-content/15 mx-1">·</span> {t('footer.lastUpdated')} {buildDate}</p>
      </div>
    </div>
  );
}
