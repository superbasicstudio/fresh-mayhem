import { useTranslation } from 'react-i18next';
import { TbGavel, TbAlertOctagon, TbSatellite, TbSpy, TbPlane } from 'react-icons/tb';

const PENALTY_KEYS = [
  { key: 'unauthorizedTx', icon: TbAlertOctagon, severity: 0.6 },
  { key: 'willfulInterference', icon: TbGavel, severity: 0.7, fineAmount: 100000 },
  { key: 'gpsJamming', icon: TbSatellite, severity: 0.9, fineAmount: 2390000 },
  { key: 'intercepting', icon: TbSpy, severity: 0.8 },
  { key: 'aviation', icon: TbPlane, severity: 1.0 },
];

function SeverityBar({ level, t }) {
  const width = level * 100;
  const color = level >= 0.9 ? '#dc2626' : level >= 0.7 ? '#f97316' : '#eab308';
  const label = level >= 0.9 ? t('penalties.severe') : level >= 0.7 ? t('penalties.high') : t('penalties.significant');
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
      <span className="text-[9px] font-mono text-base-content/30 shrink-0">{label}</span>
    </div>
  );
}

export default function PenaltyCards() {
  const { t } = useTranslation();

  const penalties = PENALTY_KEYS.map(p => ({
    ...p,
    violation: t(`penalties.violations.${p.key}.violation`),
    law: t(`penalties.violations.${p.key}.law`),
    penalty: t(`penalties.violations.${p.key}.penalty`),
    detail: t(`penalties.violations.${p.key}.detail`),
  }));

  const maxFine = Math.max(...PENALTY_KEYS.filter(p => p.fineAmount).map(p => p.fineAmount));

  return (
    <div className="space-y-4">
      {/* Summary stat bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="card bg-base-200 p-3 text-center">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-error">$2.39M</p>
          <p className="text-[10px] font-mono text-base-content/40 mt-1">{t('penalties.maxPenalty')}</p>
        </div>
        <div className="card bg-base-200 p-3 text-center">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-warning">5 yrs</p>
          <p className="text-[10px] font-mono text-base-content/40 mt-1">{t('penalties.maxPrison')}</p>
        </div>
        <div className="card bg-base-200 p-3 text-center">
          <p className="text-2xl sm:text-3xl font-mono font-bold text-error/80">FBI</p>
          <p className="text-[10px] font-mono text-base-content/40 mt-1">{t('penalties.aviationCases')}</p>
        </div>
      </div>

      {/* Penalty cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {penalties.map(p => {
          const Icon = p.icon;
          return (
            <div key={p.key} className="card bg-base-200 p-4 border border-base-content/5">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-error/60" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-base-content/90 leading-tight">{p.violation}</h4>
                  <span className="text-[10px] font-mono text-base-content/30">{p.law}</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-error leading-relaxed mb-1">{p.penalty}</p>
              <p className="text-[11px] text-base-content/40 leading-relaxed">{p.detail}</p>
              <SeverityBar level={p.severity} t={t} />
            </div>
          );
        })}
      </div>

      {/* Fine scale visualization */}
      <div className="card bg-base-200 p-4">
        <h4 className="text-xs font-mono font-semibold text-base-content/50 mb-3">{t('penalties.scaleTitle')}</h4>
        <div className="space-y-2">
          {penalties.filter(p => p.fineAmount).map(p => {
            const pct = (p.fineAmount / maxFine) * 100;
            return (
              <div key={p.key} className="flex items-center gap-3">
                <span className="text-[10px] text-base-content/50 font-mono w-28 sm:w-40 shrink-0 truncate">{p.violation}</span>
                <div className="flex-1 h-5 bg-base-300 rounded overflow-hidden relative">
                  <div
                    className="h-full rounded transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max(pct, 8)}%`,
                      background: `linear-gradient(90deg, #f43f5e44, #f43f5e)`,
                    }}
                  >
                    <span className="text-[9px] font-mono font-bold text-white/90 whitespace-nowrap">
                      ${p.fineAmount >= 1000000 ? `${(p.fineAmount / 1000000).toFixed(2)}M` : `${(p.fineAmount / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
