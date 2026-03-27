import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFirmwareVersion, getFirmwareUrl, fetchLatestFirmware } from '../data/firmware';
import HackRFIcon from './HackRFIcon';

function StatCell({ label, value, color = 'text-base-content/80', href }) {
  const inner = (
    <div className="bg-base-300/50 border border-base-content/5 rounded-lg px-3 py-2 hover:border-base-content/10 transition-colors">
      <div className="text-[9px] sm:text-[10px] text-base-content/30 font-mono uppercase tracking-widest mb-0.5">{label}</div>
      <div className={`text-xs sm:text-sm font-mono font-semibold ${color} leading-tight`}>{value}</div>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" title={`View ${label}`}>{inner}</a>;
  return inner;
}

export default function HeroHeader() {
  const { t } = useTranslation();
  const [fwVersion, setFwVersion] = useState(getFirmwareVersion);

  useEffect(() => {
    fetchLatestFirmware(setFwVersion);
  }, []);

  return (
    <div id="hero" className="bg-base-200 rounded-box px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2.5">
          <HackRFIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary/50" />
          <h1 className="page-title">{t('hero.title')}</h1>
        </div>
        <a
          href={getFirmwareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-black font-mono font-bold text-[11px] sm:text-xs tracking-wide hover:bg-white hover:text-black transition-colors"
          title="View latest Mayhem firmware releases on GitHub"
        >
          Mayhem v{fwVersion}
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
        <StatCell label={t('hero.model')} value={t('hero.modelValue')} />
        <StatCell label={t('hero.portapack')} value={t('hero.portapackValue')} />
        <StatCell label={t('hero.frequency')} value={t('hero.frequencyValue')} color="text-base-content/90" />
        <StatCell label={t('hero.txPower')} value={t('hero.txPowerValue')} color="text-error" />
        <StatCell label={t('hero.rxApps')} value={`29 ${t('common.apps')}`} color="text-primary" />
        <StatCell label={t('hero.txApps')} value={`22 ${t('common.apps')}`} color="text-error/70" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
        <StatCell label={t('hero.usb')} value="1d50:6018" color="text-base-content/50" />
        <StatCell label={t('hero.tcxo')} value="0.5 ppm" color="text-base-content/50" />
        <StatCell label={t('hero.adc')} value={t('hero.adcValue')} color="text-base-content/50" />
        <StatCell label={t('hero.status')} value={t('hero.statusValue')} color="text-primary" />
      </div>
    </div>
  );
}
