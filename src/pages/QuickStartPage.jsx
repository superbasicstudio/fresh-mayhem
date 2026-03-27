import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PageSection from '../../components/PageSection';
import QuickStartStep, { quickStartSteps } from '../../components/QuickStartStep';
import { useTranslatedQuickStart } from '../useTranslatedData';

function getCompleted() {
  let count = 0;
  try {
    for (let i = 0; i < quickStartSteps.length; i++) {
      if (localStorage.getItem(`qs-step-${i}`) === 'true') count++;
    }
  } catch {}
  return count;
}

export default function QuickStartPage() {
  const { t } = useTranslation();
  const translatedSteps = useTranslatedQuickStart(quickStartSteps);
  const [resetKey, setResetKey] = useState(0);
  const [completed, setCompleted] = useState(getCompleted);

  const handleCheck = useCallback(() => {
    setCompleted(getCompleted());
  }, []);

  const handleClear = useCallback(() => {
    try {
      for (let i = 0; i < quickStartSteps.length; i++) {
        localStorage.removeItem(`qs-step-${i}`);
      }
    } catch {}
    setResetKey(k => k + 1);
    setCompleted(0);
  }, []);

  return (
    <PageSection id="quickstart" title={t('quickstart.title')} subtitle={t('quickstart.subtitle')}>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handleClear}
          className="btn btn-xs font-mono text-[10px] text-error bg-error/10 border-0 hover:bg-error/20 shrink-0 ml-4"
          aria-label="Clear all checklist progress"
        >
          {t('quickstart.clear')}
        </button>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-base-300 rounded-full h-1.5">
          <div className="bg-accent rounded-full h-1.5 transition-all" style={{ width: `${(completed / quickStartSteps.length) * 100}%` }} />
        </div>
        <span className="text-[10px] font-mono text-accent">{completed}/{quickStartSteps.length}</span>
      </div>
      <div className="space-y-2" key={resetKey}>
        {translatedSteps.map((step, i) => (
          <QuickStartStep key={i} num={i + 1} text={step.text} section={step.section} storageKey={`qs-step-${i}`} onToggle={handleCheck} />
        ))}
      </div>
    </PageSection>
  );
}
