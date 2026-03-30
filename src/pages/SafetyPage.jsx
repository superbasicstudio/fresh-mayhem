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
                  {s.severity === 'destroyed' && <span className="badge badge-error badge-sm font-mono text-[9px] text-black px-2.5 py-2.5">DESTROYED</span>}
                  {s.severity === 'damaged' && <span className="badge badge-warning badge-sm font-mono text-[9px] text-black px-2.5 py-2.5">DAMAGED</span>}
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
                <div className="flex items-center gap-2 mt-1">
                  {s.sourceUrl ? (
                    <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono text-primary/60 hover:text-primary underline underline-offset-2 decoration-primary/20 hover:decoration-primary/60 transition-colors">
                      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {s.source}
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-base-content/30">{t('safety.source')} {s.source}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safetyTab === 'ratings' && (
        <div className="space-y-2" role="tabpanel" aria-label="TX Danger Ratings">
          <p className="text-xs text-base-content/40 mb-3 leading-relaxed">
            These are transmit (TX) apps included in the Mayhem firmware. Each one is a real app on the device.
            Expand any entry to learn what it does and understand the risk level. Ratings are general guidance only  - 
            always check your local laws and regulations before transmitting on any frequency.
          </p>
          {translatedTx.map(a => (
            <div key={a.name} className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="tx-rating-accordion" aria-label={a.name} />
              <div className="collapse-title text-sm font-medium py-2 min-h-0">
                <span className="flex items-center gap-3">
                  <span className="font-semibold min-w-0">{a.name}</span>
                  <span className="text-base-content/40 text-xs hidden sm:inline flex-1 truncate">{a.description}</span>
                  <SafetyBadge level={a.danger} />
                </span>
              </div>
              <div className="collapse-content space-y-3">
                <div className="rounded-lg p-3 bg-base-300/30 border border-base-content/5">
                  <p className="text-xs font-semibold text-base-content/60 mb-1">What is this app?</p>
                  <p className="text-sm text-base-content/60 leading-relaxed">{a.learn || a.description}</p>
                </div>
                {a.legal && (
                  <div className={`rounded-lg p-3 border ${
                    a.danger === 'extreme' ? 'bg-error/5 border-error/20' :
                    a.danger === 'illegal' ? 'bg-error/5 border-error/15' :
                    a.danger === 'danger' ? 'bg-warning/5 border-warning/15' :
                    'bg-base-300/30 border-base-content/5'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      a.danger === 'extreme' || a.danger === 'illegal' ? 'text-error/80' :
                      a.danger === 'danger' ? 'text-warning/80' : 'text-base-content/60'
                    }`}>Risk assessment</p>
                    <p className="text-sm text-base-content/60 leading-relaxed">{a.legal}</p>
                  </div>
                )}
                <div className="rounded-lg p-3 bg-base-300/30 border border-base-content/5">
                  <p className="text-xs font-semibold text-base-content/60 mb-1">Guidance</p>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    {a.danger === 'extreme'
                      ? 'This app is widely considered extremely dangerous to use on-air. In most countries, on-air use would likely be a serious criminal offense. If you must test, use a dummy load inside an RF-shielded enclosure. Check your local laws before any use.'
                      : a.danger === 'illegal'
                      ? 'This app targets systems you likely do not own or have authorization to control. In most regions, transmitting these signals would be considered unauthorized. Check your local regulations  -  there may be no general safe use case.'
                      : a.danger === 'danger'
                      ? 'This app can potentially disrupt nearby devices or services. If you choose to experiment, use a dummy load in a controlled environment. On-air use in public spaces could violate local interference laws. Always check your local regulations.'
                      : 'This app may be usable with appropriate licensing or on devices you own, depending on your region. Always verify local regulations before transmitting on any frequency. When in doubt, use a dummy load. We cannot guarantee legality in your area.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safetyTab === 'insight' && (
        <div className="space-y-4" role="tabpanel" aria-label="Amp Insight">

          {/* What is the amplifier */}
          <div className="card bg-base-200 p-4">
            <h3 className="font-semibold text-sm text-primary mb-2">What is the HackRF amplifier?</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              The HackRF One has a built-in RF amplifier (AMP) that boosts incoming signals by about +11 dB when receiving,
              or boosts your transmission power when sending. It's toggled on/off in most Mayhem apps via the on-screen controls.
              By default, AMP is OFF  -  which is the recommended starting point.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* How it works */}
            <div className="card bg-base-200 p-4">
              <h3 className="font-semibold text-sm text-primary mb-2">How it works</h3>
              <p className="text-sm text-base-content/60 leading-relaxed mb-3">
                {t('safety.ampDesc')}
              </p>
              <p className="text-sm text-base-content/60 leading-relaxed">
                This means even if you're tuned to 433 MHz, a strong cell tower at 900 MHz nearby will still hit the amplifier
                at full strength. The amp doesn't know what frequency you care about  -  it amplifies everything at once.
              </p>
            </div>

            {/* Where to find it */}
            <div className="card bg-base-200 p-4">
              <h3 className="font-semibold text-sm text-primary mb-2">Where to find it on the device</h3>
              <ul className="text-sm space-y-2 text-base-content/60 leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-primary/40 mt-0.5 shrink-0">›</span>Open any RX or TX app (Audio, ADS-B, OOK TX, etc.)</li>
                <li className="flex items-start gap-2"><span className="text-primary/40 mt-0.5 shrink-0">›</span>Look for <strong className="text-base-content/80">AMP</strong> in the on-screen settings  -  it shows ON or OFF</li>
                <li className="flex items-start gap-2"><span className="text-primary/40 mt-0.5 shrink-0">›</span>Toggle with the click wheel or touchscreen</li>
                <li className="flex items-start gap-2"><span className="text-primary/40 mt-0.5 shrink-0">›</span>Default is <strong className="text-base-content/80">OFF</strong>  -  start here and only enable if your signal is too weak</li>
              </ul>
            </div>
          </div>

          {/* Warning  -  subtle, not a giant yellow box */}
          <div className="rounded-lg p-3 bg-warning/5 border border-warning/15">
            <p className="text-xs font-semibold text-warning/70 mb-1">Important</p>
            <p className="text-xs text-base-content/50 leading-relaxed">
              {t('safety.ampBullet2')} {t('safety.ampBullet3')} {t('safety.ampBullet4')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Safe usage */}
            <div className="card bg-base-200 p-4">
              <h3 className="font-semibold text-sm text-success/80 mb-2">When to use AMP</h3>
              <ul className="text-sm space-y-2 text-base-content/60 leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-success/40 mt-0.5 shrink-0">›</span>Weak distant signals you can barely see on the waterfall</li>
                <li className="flex items-start gap-2"><span className="text-success/40 mt-0.5 shrink-0">›</span>Using an external bandpass filter in front of the HackRF</li>
                <li className="flex items-start gap-2"><span className="text-success/40 mt-0.5 shrink-0">›</span>Indoor use away from strong transmitters</li>
                <li className="flex items-start gap-2"><span className="text-success/40 mt-0.5 shrink-0">›</span>ADS-B reception at 1090 MHz with a filtered antenna</li>
              </ul>
            </div>

            {/* When NOT to use */}
            <div className="card bg-base-200 p-4">
              <h3 className="font-semibold text-sm text-error/80 mb-2">When to avoid AMP</h3>
              <ul className="text-sm space-y-2 text-base-content/60 leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-error/40 mt-0.5 shrink-0">›</span>Near cell towers, broadcast antennas, or airport radar</li>
                <li className="flex items-start gap-2"><span className="text-error/40 mt-0.5 shrink-0">›</span>Using a wideband antenna with no filter</li>
                <li className="flex items-start gap-2"><span className="text-error/40 mt-0.5 shrink-0">›</span>If the signal is already strong  -  you'll clip/distort instead of improve</li>
                <li className="flex items-start gap-2"><span className="text-error/40 mt-0.5 shrink-0">›</span>Connected to another transmitter's output (will destroy the LNA)</li>
              </ul>
            </div>
          </div>

          {/* Comparison image  -  constrained width */}
          <div className="max-w-lg">
            <ExpandableImage src="/screenshots/amp-comparison.webp" alt="AMP ON vs OFF signal comparison  -  real RF data" />
          </div>
        </div>
      )}
    </PageSection>
  );
}
