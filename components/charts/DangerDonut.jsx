import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { txApps } from '../../data/txApps';

const DANGER_COLORS = {
  extreme: '#dc2626',
  danger: '#ef4444',
  illegal: '#f97316',
  caution: '#eab308',
};

const DANGER_ORDER = ['extreme', 'danger', 'illegal', 'caution'];

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 85;
const INNER_R = 50;

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) };
  const end = { x: cx + r * Math.cos(endAngle), y: cy + r * Math.sin(endAngle) };
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function sectorPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const gap = 0.02; // small gap between sectors
  const s = startAngle + gap;
  const e = endAngle - gap;
  if (e <= s) return '';
  const outerStart = { x: cx + outerR * Math.cos(s), y: cy + outerR * Math.sin(s) };
  const outerEnd = { x: cx + outerR * Math.cos(e), y: cy + outerR * Math.sin(e) };
  const innerStart = { x: cx + innerR * Math.cos(e), y: cy + innerR * Math.sin(e) };
  const innerEnd = { x: cx + innerR * Math.cos(s), y: cy + innerR * Math.sin(s) };
  const largeArc = (e - s) > Math.PI ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

export default function DangerDonut({ onFilterDanger, activeFilter }) {
  const { t } = useTranslation();
  const { data, total } = useMemo(() => {
    const counts = {};
    txApps.forEach(a => { counts[a.danger] = (counts[a.danger] || 0) + 1; });
    const total = txApps.length;
    let angle = -Math.PI / 2;
    const data = DANGER_ORDER.map(level => {
      const count = counts[level] || 0;
      const span = (count / total) * Math.PI * 2;
      const item = { level, count, startAngle: angle, endAngle: angle + span };
      angle += span;
      return item;
    });
    return { data, total };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto" role="img" aria-label="TX app danger level distribution">
        {data.map(d => (
          <path
            key={d.level}
            d={sectorPath(CX, CY, OUTER_R, INNER_R, d.startAngle, d.endAngle)}
            fill={DANGER_COLORS[d.level]}
            opacity={activeFilter && activeFilter !== d.level ? 0.3 : 0.8}
            className="cursor-pointer transition-opacity hover:opacity-100"
            onClick={() => onFilterDanger && onFilterDanger(activeFilter === d.level ? null : d.level)}
          >
            <title>{`${t('chart.' + d.level)}: ${d.count} ${t('common.apps')}`}</title>
          </path>
        ))}
        <text x={CX} y={CY - 4} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="monospace">{total}</text>
        <text x={CX} y={CY + 14} textAnchor="middle" fill="#aaa" fontSize="10" fontFamily="monospace">{t('chart.txApps')}</text>
      </svg>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
        {DANGER_ORDER.map(level => {
          const count = txApps.filter(a => a.danger === level).length;
          const isActive = activeFilter === level;
          return (
            <button
              key={level}
              onClick={() => onFilterDanger && onFilterDanger(isActive ? null : level)}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${isActive ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/70'}`}
              aria-label={`Filter by ${t('chart.' + level)} (${count} ${t('common.apps')})`}
              aria-pressed={isActive}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DANGER_COLORS[level] }} />
              <span>{t('chart.' + level)}</span>
              <span className="text-base-content/30">{count}</span>
            </button>
          );
        })}
        <button
          onClick={() => onFilterDanger && onFilterDanger(null)}
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${!activeFilter ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/70'}`}
          aria-label="Show all apps"
          aria-pressed={!activeFilter}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-base-content/30" />
          <span>{t('chart.all')}</span>
          <span className="text-base-content/30">{txApps.length}</span>
        </button>
      </div>
    </div>
  );
}
