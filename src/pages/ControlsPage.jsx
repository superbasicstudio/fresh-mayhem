import { useTranslation } from 'react-i18next';
import { TbDeviceGamepad } from 'react-icons/tb';
import PageSection from '../../components/PageSection';
import ExpandableCard from '../../components/ExpandableCard';
import PortaPackMockup from '../../components/viz/PortaPackMockup';
import GainChain from '../../components/charts/GainChain';
import WaterfallSim from '../../components/viz/WaterfallSim';
import ExpandableImage from '../../components/ExpandableImage';

export default function ControlsPage() {
  const { t } = useTranslation();
  return (
    <PageSection id="controls" title={t('controls.title')} subtitle={t('controls.subtitle')} icon={TbDeviceGamepad}>
      <div className="grid md:grid-cols-2 gap-3">
        <ExpandableCard title={t('controls.portapackTitle')} modalMaxWidth="max-w-7xl">
          {({ expanded }) => <PortaPackMockup expanded={expanded} />}
        </ExpandableCard>

        <div className="space-y-3">
          <div className="card bg-base-200 p-4">
            <h3 className="font-semibold text-sm mb-2 text-primary">{t('controls.clickWheel')}</h3>
            <ul className="text-sm space-y-1 text-base-content/60 leading-relaxed">
              <li><strong className="text-base-content/80">{t('controls.rotateCW')}</strong> {t('controls.rotateCWDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.rotateCCW')}</strong> {t('controls.rotateCCWDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.selectShort')}</strong> {t('controls.selectShortDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.selectLong')}</strong> {t('controls.selectLongDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.leftRight')}</strong> {t('controls.leftRightDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.upFromApp')}</strong> {t('controls.upFromAppDesc')}</li>
            </ul>
          </div>
          <div className="card bg-base-200 p-4">
            <h3 className="font-semibold text-sm mb-2 text-primary">{t('controls.freqTuning')}</h3>
            <ul className="text-sm space-y-1 text-base-content/60 leading-relaxed">
              <li><strong className="text-base-content/80">{t('controls.wheel')}</strong> {t('controls.wheelDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.keypad')}</strong> {t('controls.keypadDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.digitMode')}</strong> {t('controls.digitModeDesc')}</li>
              <li><strong className="text-base-content/80">{t('controls.steps')}</strong> {t('controls.stepsDesc')}</li>
            </ul>
          </div>
        </div>

        <ExpandableCard title={t('controls.gainChain')}>
          {({ expanded }) => <GainChain expanded={expanded} />}
        </ExpandableCard>

        <ExpandableCard title={t('controls.waterfall')}>
          {({ expanded }) => <WaterfallSim expanded={expanded} />}
        </ExpandableCard>
      </div>

      {/* Emergency TX Stop — full-width red CTA */}
      <div className="mt-4 rounded-xl bg-error p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-black mb-1">{t('controls.emergencyStop')}</h3>
            <p className="text-sm text-black/60 mb-3">Currently transmitting and need to stop immediately? Follow these steps in order.</p>
            <ol className="text-sm space-y-2 text-black/80 leading-relaxed list-none">
              <li className="flex gap-3 items-center"><span className="w-6 h-6 rounded-full bg-black text-error text-xs font-bold flex items-center justify-center shrink-0">1</span> {t('controls.emergencyStep1')}</li>
              <li className="flex gap-3 items-center"><span className="w-6 h-6 rounded-full bg-black text-error text-xs font-bold flex items-center justify-center shrink-0">2</span> {t('controls.emergencyStep2')}</li>
              <li className="flex gap-3 items-center"><span className="w-6 h-6 rounded-full bg-black text-error text-xs font-bold flex items-center justify-center shrink-0">3</span> {t('controls.emergencyStep3')}</li>
              <li className="flex gap-3 items-center"><span className="w-6 h-6 rounded-full bg-black text-error text-xs font-bold flex items-center justify-center shrink-0">4</span> {t('controls.emergencyStep4')}</li>
            </ol>
          </div>
          <div className="text-black/20 text-6xl font-bold font-mono hidden md:block shrink-0">⚠</div>
        </div>
      </div>
    </PageSection>
  );
}
