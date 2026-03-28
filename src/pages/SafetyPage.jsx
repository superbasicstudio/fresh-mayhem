import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import SafetyBadge from '../../components/SafetyBadge';
import ExpandableImage from '../../components/ExpandableImage';
import { mistakes, damageStories, frequencies } from '../../data/safety';
import { txApps } from '../../data/txApps';
import { useTranslatedSafety, useTranslatedApps } from '../useTranslatedData';

export default function SafetyPage() {
  const { t } = useTranslation();
  const translatedSafety = useTranslatedSafety({ mistakes, damageStories });
  const translatedTx = useTranslatedApps(txApps, 'txApps');
  const [safetyTab, setSafetyTab] = useState('mistakes');

  const safetyTabs = [
    { key: 'mistakes', label: t('safety.tabs.mistakes') },
    { key: 'stories', label: t('safety.tabs.stories') },
    { key: 'ratings', label: t('safety.tabs.ratings') },
    { key: 'insight', label: t('safety.tabs.amp') },
  ];

  return (
    <PageSection id="safety" title={t('safety.title')} subtitle={t('safety.subtitle')} icon={ShieldExclamationIcon}>
      <div className="flex gap-1.5 sm:gap-2 mb-6 mt-2 border-b border-base-content/10 pb-3 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none" role="tablist" aria-label="Safety information tabs">
        {safetyTabs.map(({ key, label }) => (
          <button key={key} role="tab" aria-selected={safetyTab === key}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${safetyTab === key ? 'bg-base-300 text-base-content border border-primary/50' : 'text-base-content/40 hover:text-base-content/70 hover:bg-base-300/50 border border-transparent'}`}
            onClick={() => setSafetyTab(key)}>{label}</button>
        ))}
      </div>

      {safetyTab === 'mistakes' && (
        <div className="space-y-2" role="tabpanel" aria-label="Beginner Mistakes">
          {translatedSafety.mistakes.map((m, i) => (
            <div key={i} className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="mistake-accordion" aria-label={m.title} />
              <div className="collapse-title text-sm font-medium py-2 min-h-0">
                <span className="badge badge-sm font-mono text-[10px] bg-base-content text-base-200 mr-2">{i + 1}</span>
                {m.title}
                {m.severity && <span className="ml-2"><SafetyBadge level={m.severity} /></span>}
              </div>
              <div className="collapse-content space-y-3">
                <p className="text-sm text-base-content/70 leading-relaxed">{m.description}</p>
                {m.symptoms && (
                  <div>
                    <h4 className="text-xs font-semibold text-error/80 mb-1 font-mono">{t('safety.symptoms')}</h4>
                    <ul className="text-sm text-base-content/60 space-y-0.5 list-disc list-inside leading-relaxed">
                      {m.symptoms.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {m.prevention && (
                  <div>
                    <h4 className="text-xs font-semibold text-success/80 mb-1 font-mono">{t('safety.prevention')}</h4>
                    <ul className="text-sm text-base-content/60 space-y-0.5 list-disc list-inside leading-relaxed">
                      {m.prevention.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {m.technical && (
                  <div>
                    <h4 className="text-xs font-semibold text-base-content/40 mb-1 font-mono">{t('safety.technicalDetail')}</h4>
                    <p className="text-xs text-base-content/50 leading-relaxed font-mono">{m.technical}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {safetyTab === 'stories' && (
        <div className="space-y-3" role="tabpanel" aria-label="Damage Stories">
          {translatedSafety.damageStories.map((s, i) => (
            <div key={i} className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="story-accordion" aria-label={s.title} />
              <div className="collapse-title text-sm font-medium py-2 min-h-0">
                <span className="flex items-center gap-2">
                  {s.title}
                  {s.severity === 'destroyed' && <span className="badge badge-error badge-xs font-mono text-[9px]">DESTROYED</span>}
                  {s.severity === 'damaged' && <span className="badge badge-warning badge-xs font-mono text-[9px]">DAMAGED</span>}
                </span>
              </div>
              <div className="collapse-content space-y-3">
                <p className="text-sm text-base-content/60 leading-relaxed">{s.description}</p>
                {s.outcome && (
                  <div className="card bg-error/5 border border-error/20 p-3">
                    <p className="text-xs font-semibold text-error/80 mb-1">{t('safety.outcome', { defaultValue: 'Outcome' })}</p>
                    <p className="text-xs text-base-content/60 leading-relaxed">{s.outcome}</p>
                  </div>
                )}
                {s.prevention && (
                  <div className="card bg-success/5 border border-success/20 p-3">
                    <p className="text-xs font-semibold text-success/80 mb-1">{t('safety.prevention')}</p>
                    <p className="text-xs text-base-content/60 leading-relaxed">{s.prevention}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {s.sourceUrl ? (
                    <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="badge badge-ghost badge-sm font-mono text-[10px] hover:text-primary">
                      {t('safety.source')} {s.source}
                    </a>
                  ) : (
                    <span className="badge badge-ghost badge-sm font-mono text-[10px]">{t('safety.source')} {s.source}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safetyTab === 'ratings' && (
        <div className="overflow-x-auto" role="tabpanel" aria-label="TX Danger Ratings">
          <table className="table table-xs">
            <thead><tr><th scope="col">{t('safety.tableApp')}</th><th scope="col">{t('safety.tableDescription')}</th><th scope="col">{t('safety.tableRating')}</th></tr></thead>
            <tbody>
              {translatedTx.map(a => (
                <tr key={a.name}>
                  <td className="font-semibold">{a.name}</td>
                  <td className="text-base-content/60">{a.description}</td>
                  <td><SafetyBadge level={a.danger} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {safetyTab === 'insight' && (
        <div className="alert alert-warning" role="tabpanel" aria-label="Amp Insight">
          <div>
            <h3 className="font-bold text-sm">{t('safety.ampTitle')}</h3>
            <p className="text-sm mt-1 leading-relaxed">{t('safety.ampDesc')}</p>
            <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>{t('safety.ampBullet1')}</li>
              <li>{t('safety.ampBullet2')}</li>
              <li>{t('safety.ampBullet3')}</li>
              <li>{t('safety.ampBullet4')}</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4">
        <ExpandableImage src="/screenshots/amp-comparison.webp" alt="AMP ON vs OFF signal comparison — real RF data" />
      </div>
    </PageSection>
  );
}
