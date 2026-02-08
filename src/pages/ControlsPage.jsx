import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import PageSection from '../../components/PageSection';
import ExpandableCard from '../../components/ExpandableCard';
import PortaPackMockup from '../../components/viz/PortaPackMockup';
import GainChain from '../../components/charts/GainChain';
import WaterfallSim from '../../components/viz/WaterfallSim';
import ExpandableImage from '../../components/ExpandableImage';

export default function ControlsPage() {
  return (
    <PageSection id="controls" title="Controls & Navigation" subtitle="Interactive PortaPack H4M simulator, gain chain calculator, and waterfall display. Learn the hardware controls before powering on." icon={AdjustmentsHorizontalIcon}>
      <div className="grid md:grid-cols-2 gap-3">
        <ExpandableCard title="PortaPack H4M" modalMaxWidth="max-w-7xl">
          {({ expanded }) => <PortaPackMockup expanded={expanded} />}
        </ExpandableCard>

        <div className="space-y-3">
          <div className="card bg-base-200 p-4">
            <h3 className="font-semibold text-sm mb-2 text-primary">Click Wheel</h3>
            <ul className="text-sm space-y-1 text-base-content/60 leading-relaxed">
              <li><strong className="text-base-content/80">Rotate CW:</strong> Scroll down / increase value</li>
              <li><strong className="text-base-content/80">Rotate CCW:</strong> Scroll up / decrease value</li>
              <li><strong className="text-base-content/80">SELECT (short):</strong> Confirm / open keypad</li>
              <li><strong className="text-base-content/80">SELECT (long):</strong> Digit-by-digit tune mode</li>
              <li><strong className="text-base-content/80">LEFT/RIGHT:</strong> Move between fields</li>
              <li><strong className="text-base-content/80">UP (from app):</strong> Jump to title bar icons</li>
            </ul>
          </div>
          <div className="card bg-base-200 p-4">
            <h3 className="font-semibold text-sm mb-2 text-primary">Frequency Tuning</h3>
            <ul className="text-sm space-y-1 text-base-content/60 leading-relaxed">
              <li><strong className="text-base-content/80">Wheel:</strong> Select freq field, rotate to change by step size</li>
              <li><strong className="text-base-content/80">Keypad:</strong> Short-press SELECT on freq field, type digits</li>
              <li><strong className="text-base-content/80">Digit mode:</strong> Long-press SELECT, digit turns blue, wheel to change</li>
              <li><strong className="text-base-content/80">Steps:</strong> 10M down to 10 Hz (18 options)</li>
            </ul>
          </div>
        </div>

        <ExpandableCard title="Gain Chain Calculator">
          {({ expanded }) => <GainChain expanded={expanded} />}
        </ExpandableCard>

        <ExpandableCard title="Waterfall Display Simulation">
          {({ expanded }) => <WaterfallSim expanded={expanded} />}
        </ExpandableCard>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div className="card bg-base-200 p-4">
          <h3 className="font-semibold text-sm mb-2 text-error">Emergency TX Stop</h3>
          <ol className="text-sm space-y-1.5 text-base-content/60 leading-relaxed list-none">
            <li className="flex gap-2"><span className="badge badge-error badge-sm font-mono text-[10px] !text-black shrink-0">1</span> Press Start/Stop in the TX app</li>
            <li className="flex gap-2"><span className="badge badge-error badge-sm font-mono text-[10px] !text-black shrink-0">2</span> Tap back arrow to exit TX app</li>
            <li className="flex gap-2"><span className="badge badge-error badge-sm font-mono text-[10px] !text-black shrink-0">3</span> Press RESET button (panic)</li>
            <li className="flex gap-2"><span className="badge badge-error badge-sm font-mono text-[10px] !text-black shrink-0">4</span> Power switch OFF (nuclear)</li>
          </ol>
        </div>
        <div className="md:col-span-2">
          <ExpandableImage src="/screenshots/main-menu.png" alt="Mayhem main menu" />
        </div>
      </div>
    </PageSection>
  );
}
