import { useState } from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import SafetyBadge from '../../components/SafetyBadge';
import ExpandableImage from '../../components/ExpandableImage';
import { mistakes, damageStories, frequencies } from '../../data/safety';
import { txApps } from '../../data/txApps';

const safetyTabs = [
  { key: 'mistakes', label: 'Beginner Mistakes' },
  { key: 'stories', label: 'Damage Stories' },
  { key: 'ratings', label: 'TX Danger Ratings' },
  { key: 'insight', label: 'Amp Insight' },
];

export default function SafetyPage() {
  const [safetyTab, setSafetyTab] = useState('mistakes');

  return (
    <PageSection id="safety" title="Safety Center" subtitle="Common mistakes, real damage stories, TX danger ratings, and amplifier behavior for the HackRF One + PortaPack." icon={ShieldExclamationIcon}>
      <div className="flex gap-1.5 sm:gap-2 mb-6 mt-2 border-b border-base-content/10 pb-3 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none" role="tablist" aria-label="Safety information tabs">
        {safetyTabs.map(({ key, label }) => (
          <button key={key} role="tab" aria-selected={safetyTab === key}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${safetyTab === key ? 'bg-base-300 text-base-content border border-primary/50' : 'text-base-content/40 hover:text-base-content/70 hover:bg-base-300/50 border border-transparent'}`}
            onClick={() => setSafetyTab(key)}>{label}</button>
        ))}
      </div>

      {safetyTab === 'mistakes' && (
        <div className="space-y-2" role="tabpanel" aria-label="Beginner Mistakes">
          {mistakes.map((m, i) => (
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
                    <h4 className="text-xs font-semibold text-error/80 mb-1 font-mono">SYMPTOMS</h4>
                    <ul className="text-sm text-base-content/60 space-y-0.5 list-disc list-inside leading-relaxed">
                      {m.symptoms.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {m.prevention && (
                  <div>
                    <h4 className="text-xs font-semibold text-success/80 mb-1 font-mono">PREVENTION</h4>
                    <ul className="text-sm text-base-content/60 space-y-0.5 list-disc list-inside leading-relaxed">
                      {m.prevention.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {m.technical && (
                  <div>
                    <h4 className="text-xs font-semibold text-base-content/40 mb-1 font-mono">TECHNICAL DETAIL</h4>
                    <p className="text-xs text-base-content/50 leading-relaxed font-mono">{m.technical}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {safetyTab === 'stories' && (
        <div className="space-y-2" role="tabpanel" aria-label="Damage Stories">
          {damageStories.map((s, i) => (
            <div key={i} className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="story-accordion" aria-label={s.title} />
              <div className="collapse-title text-sm font-medium py-2 min-h-0">{s.title}</div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/70 leading-relaxed">{s.description}</p>
                <span className="badge badge-ghost badge-sm font-mono text-[10px] mt-2">Source: {s.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {safetyTab === 'ratings' && (
        <div className="overflow-x-auto" role="tabpanel" aria-label="TX Danger Ratings">
          <table className="table table-xs">
            <thead><tr><th scope="col">App</th><th scope="col">Description</th><th scope="col">Rating</th></tr></thead>
            <tbody>
              {txApps.map(a => (
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
            <h3 className="font-bold text-sm">The Amplifier Sees Everything</h3>
            <p className="text-sm mt-1 leading-relaxed">The HackRF&apos;s front-end amplifier operates across its entire 6+ GHz bandwidth simultaneously. There is no narrow bandpass filter before the amp. Tuning/filtering happens after amplification.</p>
            <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Tuned to 433 MHz but cell tower at 900 MHz nearby? Amp still gets the full cell signal.</li>
              <li>Your tuned frequency provides NO protection to the amplifier from out-of-band signals.</li>
              <li>External bandpass filters before the HackRF input are the proper mitigation.</li>
              <li>An inline attenuator is critical near any strong signal source.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4">
        <ExpandableImage src="/screenshots/amp-comparison.png" alt="AMP ON vs OFF signal comparison — real RF data" />
      </div>
    </PageSection>
  );
}
