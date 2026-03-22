import { useState, useCallback } from 'react';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import QuickStartStep, { quickStartSteps } from '../../components/QuickStartStep';

export default function QuickStartPage() {
  const [resetKey, setResetKey] = useState(0);

  let completed = 0;
  try { completed = quickStartSteps.filter((_, i) => localStorage.getItem(`qs-step-${i}`) === 'true').length; } catch {}

  const handleClear = useCallback(() => {
    try {
      for (let i = 0; i < quickStartSteps.length; i++) {
        localStorage.removeItem(`qs-step-${i}`);
      }
    } catch {}
    setResetKey(k => k + 1);
  }, []);

  return (
    <PageSection id="quickstart" title="HackRF + PortaPack — Quick Start" subtitle="Complete setup walkthrough from unboxing to your first FM receive session. Covers SD card prep, firmware, calibration, safety, and shutdown. Check off each step — progress is saved locally." icon={RocketLaunchIcon}>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handleClear}
          className="btn btn-xs font-mono text-[10px] text-error bg-error/10 border-0 hover:bg-error/20 shrink-0 ml-4"
          aria-label="Clear all checklist progress"
        >
          CLEAR
        </button>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-base-300 rounded-full h-1.5">
          <div className="bg-accent rounded-full h-1.5 transition-all" style={{ width: `${(completed / quickStartSteps.length) * 100}%` }} />
        </div>
        <span className="text-[10px] font-mono text-accent">{completed}/{quickStartSteps.length}</span>
      </div>
      <div className="space-y-2" key={resetKey}>
        {quickStartSteps.map((step, i) => (
          <QuickStartStep key={i} num={i + 1} text={step.text} section={step.section} storageKey={`qs-step-${i}`} />
        ))}
      </div>
    </PageSection>
  );
}
