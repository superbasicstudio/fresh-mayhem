import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const POLL_INTERVAL = 60_000; // 60 seconds

const COUNTRY_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

function getCountryName(code) {
  try {
    return COUNTRY_NAMES.of(code) || code;
  } catch {
    return code;
  }
}

function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

export default function LiveVisitors() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const res = await fetch('/api/visitors');
        if (res.ok) {
          const json = await res.json();
          if (active) setData(json);
        }
      } catch {}
    }

    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, []);

  if (!data || data.count === 0) return null;

  const { count, countries = [] } = data;
  const countryCount = countries.length;

  return (
    <span
      ref={ref}
      className="relative inline-flex items-center gap-1.5 text-[10px] font-mono text-base-content/40 cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
      </span>
      {t('liveVisitors.label', { count })}

      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-base-300 border border-base-content/10 rounded-lg shadow-xl p-3 text-left z-50 pointer-events-none">
          <span className="block text-[11px] font-semibold text-base-content/70 mb-1.5">
            {t('liveVisitors.tooltipTitle')}
          </span>
          <span className="block text-[10px] text-base-content/50 mb-2">
            {t('liveVisitors.tooltipDesc', { count })}
          </span>
          {countryCount > 0 && (
            <>
              <span className="block text-[10px] text-base-content/40 mb-1">
                {t('liveVisitors.countriesLabel', { count: countryCount })}
              </span>
              <span className="block space-y-0.5">
                {countries.map((c) => (
                  <span key={c.code} className="flex items-center justify-between text-[10px] text-base-content/50">
                    <span>{countryFlag(c.code)} {getCountryName(c.code)}</span>
                    <span className="text-base-content/30">{c.visitors}</span>
                  </span>
                ))}
              </span>
            </>
          )}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-base-300" />
        </span>
      )}
    </span>
  );
}
