import { useTranslation } from 'react-i18next';
import PageSection from '../../components/PageSection';
import ExpandableCard from '../../components/ExpandableCard';
import FrequencySpectrum from '../../components/charts/FrequencySpectrum';
import BandMap from '../../components/charts/BandMap';
import PenaltyCards from '../../components/charts/PenaltyCards';
import { frequencies } from '../../data/safety';
import {
  TbPlane, TbSatellite, TbDeviceMobile, TbShieldLock,
  TbSailboat, TbCloudStorm, TbRadar2, TbWifi, TbAntenna,
  TbLicense, TbGavel, TbAlertTriangle,
} from 'react-icons/tb';

const BAND_ICONS = {
  'Aviation VOR/ILS': TbPlane,
  'Aviation Voice': TbPlane,
  'Aviation Emergency': TbPlane,
  'Aviation ELT': TbPlane,
  'GPS L1': TbSatellite,
  'GPS L2': TbSatellite,
  'GPS L5': TbSatellite,
  'GLONASS L1': TbSatellite,
  'GLONASS L2': TbSatellite,
  'Galileo E1': TbSatellite,
  'Cellular': TbDeviceMobile,
  'Public Safety': TbShieldLock,
  'Marine VHF': TbSailboat,
  'Marine Distress': TbSailboat,
  'NOAA Weather': TbCloudStorm,
  'Radar': TbRadar2,
  'ISM 433 MHz': TbWifi,
  'ISM 902-928 MHz': TbWifi,
  'ISM 2.4 GHz': TbWifi,
  'ISM 5.8 GHz': TbWifi,
  'Amateur bands': TbAntenna,
};

export default function FrequenciesPage() {
  const { t } = useTranslation();
  return (
    <PageSection id="frequencies" title={t('frequencies.title')} subtitle={t('frequencies.subtitle')}>
      <ExpandableCard title={t('frequencies.spectrumTitle')} titleColor="text-base-content">
        {() => <FrequencySpectrum />}
      </ExpandableCard>
      <BandMap />
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="font-semibold text-sm text-error mb-2">{t('frequencies.noGoTitle')}</h3>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead><tr><th scope="col"></th><th scope="col">{t('frequencies.band')}</th><th scope="col">{t('frequencies.range')}</th><th scope="col">{t('frequencies.service')}</th></tr></thead>
              <tbody>
                {frequencies.noGo.map((f, i) => {
                  const Icon = BAND_ICONS[f.band] || TbAlertTriangle;
                  return (
                    <tr key={i}>
                      <td className="w-6"><Icon className="w-4 h-4 text-error/40" /></td>
                      <td className="text-base-content/70">{f.band}</td>
                      <td className="font-mono text-error">{f.range}</td>
                      <td className="text-base-content/60">{f.service}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-success mb-2">{t('frequencies.legalTitle')}</h3>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead><tr><th scope="col"></th><th scope="col">{t('frequencies.band')}</th><th scope="col">{t('frequencies.range')}</th><th scope="col">{t('frequencies.requirements')}</th></tr></thead>
              <tbody>
                {frequencies.legal.map((f, i) => {
                  const Icon = BAND_ICONS[f.band] || TbWifi;
                  return (
                    <tr key={i}>
                      <td className="w-6"><Icon className="w-4 h-4 text-success/40" /></td>
                      <td className="text-base-content/70">{f.band}</td>
                      <td className="font-mono text-success">{f.range}</td>
                      <td className="text-base-content/60">{f.requirements}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-warning mb-3">{t('frequencies.penaltiesTitle')}</h3>
          <PenaltyCards />
        </div>
        <p className="text-[10px] text-base-content/30 mt-4 leading-relaxed">{t('frequencies.disclaimer')}</p>
      </div>
    </PageSection>
  );
}
