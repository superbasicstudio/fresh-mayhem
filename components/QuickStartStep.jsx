import { useState, useEffect, useId } from 'react';

export const quickStartSteps = [
  "Connect the telescopic antenna (40 MHz - 6 GHz) finger-tight",
  "Slide the power switch UP, wait for Mayhem main menu",
  "Tap 'Receive', then tap 'Audio'",
  "Choose 'WFM' (Wideband FM) mode",
  "Set frequency to a local FM station (e.g. 101.1 MHz)",
  "Set gains: LNA=16, VGA=20, AMP=0 (OFF)",
  "Turn volume up to 40-60",
  "Listen -- RSSI bar should show signal, waterfall shows bright spot",
  "If weak: increase VGA first, then LNA. If clipping: decrease gains.",
  "Tap the back arrow to return to menus",
  "Slide the power switch DOWN to power off",
];

export default function QuickStartStep({ num, text, storageKey }) {
  const [checked, setChecked] = useState(false);
  const checkId = useId();
  useEffect(() => {
    try { setChecked(localStorage.getItem(storageKey) === 'true'); } catch {}
  }, [storageKey]);
  const toggle = () => {
    const next = !checked;
    setChecked(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {}
  };
  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${checked ? 'bg-success/10' : 'bg-base-200'}`}>
      <input id={checkId} type="checkbox" className="checkbox checkbox-success checkbox-sm mt-0.5" checked={checked} onChange={toggle}
        aria-label={`Step ${num}: ${text}`} />
      <label htmlFor={checkId} className="cursor-pointer">
        <span className="badge badge-ghost badge-sm font-mono text-[10px] mr-2">{num}</span>
        <span className="text-sm font-body">{text}</span>
      </label>
    </div>
  );
}
