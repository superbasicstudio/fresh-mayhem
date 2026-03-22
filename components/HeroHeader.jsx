import HackRFIcon from './HackRFIcon';

export default function HeroHeader() {
  const device = [
    { label: 'Model', value: 'HackRF One R10C', color: 'text-base-content/80', priority: true },
    { label: 'PortaPack', value: 'H4M', color: 'text-base-content/80', priority: true },
    { label: 'USB', value: '1d50:6018', color: 'text-base-content/60', priority: false },
    { label: 'TCXO', value: '0.5 ppm', color: 'text-base-content/60', priority: false },
    { label: 'ADC', value: '8-bit / 20 Msps', color: 'text-base-content/60', priority: false },
  ];

  const stats = [
    { label: 'Firmware', value: 'Mayhem v2.3.2', color: 'text-primary', priority: true },
    { label: 'Freq', value: '1 MHz – 6 GHz', color: 'text-base-content/70', priority: true },
    { label: 'TX max', value: '~15 dBm (32 mW)', color: 'text-error', priority: false },
    { label: 'RX', value: '29 apps', color: 'text-base-content/70', priority: true },
    { label: 'TX', value: '22 apps', color: 'text-base-content/70', priority: true },
    { label: 'Status', value: 'Operational', color: 'text-primary', priority: true },
  ];

  return (
    <div id="hero" className="bg-base-200 rounded-box px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 mb-4 sm:mb-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <HackRFIcon className="w-7 h-7 sm:w-10 sm:h-10 text-primary" />
              <h1 className="font-display text-base sm:text-xl lg:text-2xl text-primary tracking-wide leading-relaxed">Fresh Mayhem</h1>
            </div>
            <p className="text-xs sm:text-sm text-base-content/40 mt-1 font-body leading-relaxed">Interactive guide to <span className="text-primary/70 font-medium">Mayhem firmware</span> for PortaPack H4M + HackRF One</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1" role="group" aria-label="Device identification">
            {device.map((d, i) => (
              <span key={d.label} className={`flex items-center gap-x-2 sm:gap-x-3 ${!d.priority ? 'hidden sm:flex' : ''}`}>
                <span className="text-[10px] sm:text-xs leading-none">
                  <span className="text-base-content/30 font-body">{d.label} </span>
                  <span className={`font-mono ${d.color}`}>{d.value}</span>
                </span>
                {i < device.length - 1 && <span className="text-base-content/10 hidden sm:inline" aria-hidden="true">|</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-base-content/5 pt-2 sm:pt-3 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1" role="group" aria-label="Dashboard statistics">
          {stats.map((s, i) => (
            <span key={s.label} className={`flex items-center gap-x-2 sm:gap-x-3 ${!s.priority ? 'hidden sm:flex' : ''}`}>
              <span className="text-[10px] sm:text-xs leading-none">
                <span className="text-base-content/40 font-body">{s.label} </span>
                <span className={`font-semibold font-mono ${s.color}`}>{s.value}</span>
              </span>
              {i < stats.length - 1 && <span className="text-base-content/10 hidden sm:inline" aria-hidden="true">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
