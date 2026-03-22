import { TbWaveSine } from 'react-icons/tb';
import PageSection from '../../components/PageSection';
import ExpandableCard from '../../components/ExpandableCard';
import ExpandableImage from '../../components/ExpandableImage';
import FrequencySpectrum from '../../components/charts/FrequencySpectrum';
import { frequencies } from '../../data/safety';

export default function FrequenciesPage() {
  return (
    <PageSection id="frequencies" title="Learn About Radio Frequencies (RF)" subtitle="RF spectrum coverage from 1 MHz to 6 GHz — no-go zones, legal TX bands, and penalty reference for the US." icon={TbWaveSine}>
      <ExpandableCard title="RF Spectrum Coverage" titleColor="text-base-content">
        {() => <FrequencySpectrum />}
      </ExpandableCard>
      <div className="mt-3">
        <ExpandableImage src="/screenshots/full-spectrum.png" alt="HackRF One full spectrum 70 MHz - 6 GHz (live capture)" />
      </div>
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="font-semibold text-sm text-error mb-2">No-Go Frequencies — US Federal Restrictions</h3>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead><tr><th scope="col">Band</th><th scope="col">Range</th><th scope="col">Service</th></tr></thead>
              <tbody>
                {frequencies.noGo.map((f, i) => (
                  <tr key={i}><td className="text-base-content/70">{f.band}</td><td className="font-mono text-error">{f.range}</td><td className="text-base-content/60">{f.service}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-success mb-2">Legal TX Bands (With Conditions)</h3>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead><tr><th scope="col">Band</th><th scope="col">Range</th><th scope="col">Requirements</th></tr></thead>
              <tbody>
                {frequencies.legal.map((f, i) => (
                  <tr key={i}><td className="text-base-content/70">{f.band}</td><td className="font-mono text-success">{f.range}</td><td className="text-base-content/60">{f.requirements}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-warning mb-2">Legal Consequences (US Federal Law)</h3>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead><tr><th scope="col">Violation</th><th scope="col">Law</th><th scope="col">Penalty</th></tr></thead>
              <tbody>
                {frequencies.penalties.map((p, i) => (
                  <tr key={i}><td className="text-base-content/70">{p.violation}</td><td className="font-mono">{p.law}</td><td className="text-error">{p.penalty}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-[10px] text-base-content/30 mt-4 leading-relaxed">Frequency restrictions and penalties shown are based on US federal regulations (FCC/FAA). Laws vary significantly by country and region. This is not legal advice — always verify regulations in your jurisdiction before transmitting.</p>
      </div>
    </PageSection>
  );
}
