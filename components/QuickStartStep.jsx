import { useState, useEffect, useId } from 'react';

export const quickStartSteps = [
  // Phase 1: Pre-Power Setup
  { text: "Verify your USB cable is data-capable (not charge-only) — this is the #1 setup issue", section: "Before You Power On" },
  { text: "Insert a MicroSD card (FAT32, 8-32 GB recommended) — stores captures, settings, and apps" },
  { text: "Download latest Mayhem firmware from GitHub releases and copy .ppfw.tar to SD root" },
  { text: "Attach the telescopic antenna (40 MHz–6 GHz) to the SMA port — finger-tight only, never wrench" },
  { text: "Ground yourself before handling — ESD on the SMA center pin can damage the LNA" },
  { text: "Have a 50-ohm dummy load ready if you plan to test any TX apps" },

  // Phase 2: First Power-On
  { text: "Slide the power switch UP — wait for the Mayhem main menu to appear", section: "First Power-On" },
  { text: "Check firmware version on the status bar (current: v2.3.2)" },
  { text: "Go to Settings → SD Card → Test to verify your SD card is detected and working" },
  { text: "Go to Settings → UI → set encoder sensitivity to your preference (low/normal/high)" },
  { text: "Go to Settings → Date/Time → set the real-time clock for accurate capture timestamps" },

  // Phase 3: Your First Receive
  { text: "Navigate to Receive → Audio", section: "Your First FM Receive" },
  { text: "Set mode to 'WFM' (Wideband FM)" },
  { text: "Set frequency to a local FM station (e.g. 101.1 MHz)" },
  { text: "Set gains: LNA=16, VGA=20, AMP=0 (OFF) — always start with AMP off" },
  { text: "Turn volume up to 40–60 — you should hear the station" },
  { text: "Check the RSSI bar and waterfall — a strong signal shows a bright vertical band" },
  { text: "If weak: increase VGA first, then LNA. If clipping/distortion: decrease gains" },

  // Phase 4: Calibration
  { text: "Tune to a known FM station and note if the frequency is slightly off", section: "Frequency Calibration" },
  { text: "Go to Settings → Radio → Frequency Correction and adjust until the station centers correctly" },
  { text: "This corrects your TCXO offset — improves accuracy across all apps" },

  // Phase 5: Safety & Shutdown
  { text: "Before any TX: connect a 50-ohm dummy load or frequency-matched antenna — never TX into open air", section: "Safety & Shutdown" },
  { text: "Learn the Emergency TX Stop: Stop button → Back arrow → RESET → Power OFF" },
  { text: "Never operate within 10 feet of active transmitters (handhelds, routers) while receiving" },
  { text: "Tap the back arrow to return to menus" },
  { text: "Slide the power switch DOWN to power off — always power off before disconnecting antenna" },
];

export default function QuickStartStep({ num, text, storageKey, section, onToggle }) {
  const [checked, setChecked] = useState(false);
  const checkId = useId();
  useEffect(() => {
    try { setChecked(localStorage.getItem(storageKey) === 'true'); } catch {}
  }, [storageKey]);
  const toggle = () => {
    const next = !checked;
    setChecked(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {}
    if (onToggle) onToggle();
  };
  return (
    <>
      {section && (
        <div className="pt-4 pb-1 first:pt-0">
          <h3 className="text-xs font-mono font-semibold text-primary/70 tracking-wider uppercase">{section}</h3>
        </div>
      )}
      <div className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${checked ? 'bg-success/10' : 'bg-base-200'}`}>
        <input id={checkId} type="checkbox" className="checkbox checkbox-success checkbox-sm mt-0.5" checked={checked} onChange={toggle}
          aria-label={`Step ${num}: ${text}`} />
        <label htmlFor={checkId} className={`cursor-pointer ${checked ? 'line-through text-base-content/30' : ''}`}>
          <span className="text-sm font-body">{text}</span>
        </label>
      </div>
    </>
  );
}
