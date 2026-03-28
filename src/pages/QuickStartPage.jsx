import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PageSection from '../../components/PageSection';
import QuickStartStep, { quickStartSteps } from '../../components/QuickStartStep';
import { useTranslatedQuickStart } from '../useTranslatedData';
import { TbAlertTriangle, TbDownload } from 'react-icons/tb';

const updateSteps = [
  { text: "Power off the PortaPack. Slide the hardware power switch DOWN and wait for the screen to go dark. Do not just press RESET.", section: "Download & Prepare" },
  { text: "Remove the MicroSD card. Gently push in to release from the spring-loaded slot, then pull out. Handle by the edges." },
  { text: "Download the firmware (.ppfw.tar) and SD card content (.zip) from the GitHub releases page for your device model." },
  { text: "Mount the SD card on your computer. It should appear as a FAT32 volume with existing Mayhem folders." },
  { text: "Copy the .ppfw.tar firmware file into the FIRMWARE/ folder on the SD card. Create the folder if it does not exist.", section: "Flash the Firmware" },
  { text: "Extract the COPY_TO_SDCARD zip to the root of the SD card. Choose overwrite/replace all when prompted. Your personal settings and captures will not be overwritten." },
  { text: "Safely eject the SD card from your computer. On Linux run sync first. On Windows/macOS use Safely Remove or Eject." },
  { text: "Reinsert the SD card into the PortaPack until it clicks. Gold contacts face toward the PCB.", section: "Install on Device" },
  { text: "Power on and navigate to Utilities > Flash Utility. Use the click wheel or touchscreen." },
  { text: "Select the .ppfw.tar file from the FIRMWARE/ folder. Only .ppfw.tar files work with the on-device Flash Utility. You may also see a .bin file on the SD card from the zip. That file is only for PC-side flashing via hackrf_spiflash over USB. The Flash Utility will not accept it. Ignore it. The device will flash for 15 to 30 seconds. Do not power off or remove the SD card during flashing." },
  { text: "Device reboots automatically. Verify the new version in the status bar or under Settings > About.", section: "After Updating" },
  { text: "Review new apps and features in the Receive and Transmit menus." },
  { text: "Check Settings for any new safety or configuration options added in the update." },
  { text: "Recalibrate the touchscreen if needed: Utilities > Touch Calibrate." },
];

const troubleshooting = [
  { problem: "Flash Utility does not see the file", fix: "Make sure the file is in FIRMWARE/ (not nested in a subfolder) and the filename ends in .ppfw.tar" },
  { problem: "Device will not boot after flash", fix: "Hold the DFU button + press RESET to enter DFU recovery mode. The bootloader is in ROM and cannot be bricked. Reflash via dfu-util + hackrf_spiflash from a computer." },
  { problem: "Apps missing after update", fix: "SD card content was not updated. Re-extract the COPY_TO_SDCARD zip to the SD root with overwrite enabled." },
  { problem: "SD card not detected", fix: "Reformat as FAT32 (not exFAT). Cards over 32 GB may need a third-party FAT32 formatting tool." },
  { problem: "I see a .bin file on the SD card, should I use it?", fix: "No. The .bin file is for PC-side flashing via hackrf_spiflash over USB only. The on-device Flash Utility only accepts .ppfw.tar files. The .bin may appear red or unselectable in the file browser. It cannot harm the device. Ignore it." },
];

function getCompleted() {
  let count = 0;
  try {
    for (let i = 0; i < quickStartSteps.length; i++) {
      if (localStorage.getItem(`qs-step-${i}`) === 'true') count++;
    }
  } catch {}
  return count;
}

function getUpdateCompleted() {
  let count = 0;
  try {
    for (let i = 0; i < updateSteps.length; i++) {
      if (localStorage.getItem(`fw-step-${i}`) === 'true') count++;
    }
  } catch {}
  return count;
}

export default function QuickStartPage() {
  const { t } = useTranslation();
  const translatedSteps = useTranslatedQuickStart(quickStartSteps);
  const [resetKey, setResetKey] = useState(0);
  const [completed, setCompleted] = useState(getCompleted);
  const [updateResetKey, setUpdateResetKey] = useState(0);
  const [updateCompleted, setUpdateCompleted] = useState(getUpdateCompleted);

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

  const handleUpdateCheck = useCallback(() => {
    setUpdateCompleted(getUpdateCompleted());
  }, []);

  const handleUpdateClear = useCallback(() => {
    try {
      for (let i = 0; i < updateSteps.length; i++) {
        localStorage.removeItem(`fw-step-${i}`);
      }
    } catch {}
    setUpdateResetKey(k => k + 1);
    setUpdateCompleted(0);
  }, []);

  return (
    <>
      <PageSection id="quickstart" title={t('quickstart.title')} subtitle={t('quickstart.subtitle')}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleClear}
            disabled={completed === 0}
            className={`btn btn-xs font-mono text-[10px] border-0 shrink-0 ml-4 ${completed > 0 ? 'text-error bg-error/10 hover:bg-error/20' : 'text-base-content/20 bg-base-300/30 cursor-not-allowed'}`}
            aria-label="Clear checklist below"
          >
            {t('quickstart.clear')} ({completed})
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

      <PageSection id="firmware-update" title={t('firmwareUpdate.title')} subtitle={t('firmwareUpdate.subtitle')}>
        <div className="card bg-base-300/50 border border-warning/20 p-4 mb-4">
          <div className="flex gap-3">
            <TbAlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning mb-1">{t('firmwareUpdate.beforeYouStart')}</p>
              <ul className="text-xs text-base-content/50 leading-relaxed space-y-1">
                <li>{t('firmwareUpdate.prereq1')}</li>
                <li>{t('firmwareUpdate.prereq2')}</li>
                <li>{t('firmwareUpdate.prereq3')}</li>
                <li>{t('firmwareUpdate.prereq4')}</li>
              </ul>
            </div>
          </div>
        </div>

        <a
          href="https://github.com/portapack-mayhem/mayhem-firmware/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-primary font-mono text-[11px] mb-4 gap-2"
        >
          <TbDownload className="w-4 h-4" />
          {t('firmwareUpdate.downloadButton')}
        </a>

        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleUpdateClear}
            disabled={updateCompleted === 0}
            className={`btn btn-xs font-mono text-[10px] border-0 shrink-0 ml-4 ${updateCompleted > 0 ? 'text-error bg-error/10 hover:bg-error/20' : 'text-base-content/20 bg-base-300/30 cursor-not-allowed'}`}
            aria-label="Clear checklist below"
          >
            {t('quickstart.clear')} ({updateCompleted})
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-base-300 rounded-full h-1.5">
            <div className="bg-accent rounded-full h-1.5 transition-all" style={{ width: `${(updateCompleted / updateSteps.length) * 100}%` }} />
          </div>
          <span className="text-[10px] font-mono text-accent">{updateCompleted}/{updateSteps.length}</span>
        </div>
        <div className="space-y-2" key={updateResetKey}>
          {updateSteps.map((step, i) => {
            const sectionMap = { 'Download & Prepare': 'downloadPrepare', 'Flash the Firmware': 'flashFirmware', 'Install on Device': 'installOnDevice', 'After Updating': 'afterUpdating' };
            const translatedSection = step.section ? t(`firmwareUpdate.sections.${sectionMap[step.section]}`, { defaultValue: step.section }) : undefined;
            const translatedText = t(`firmwareUpdate.steps.s${i + 1}`, { defaultValue: step.text });
            return (
              <QuickStartStep key={i} num={i + 1} text={translatedText} section={translatedSection} storageKey={`fw-step-${i}`} onToggle={handleUpdateCheck} />
            );
          })}
        </div>

        <h3 className="font-semibold text-sm text-warning mt-6 mb-3">{t('firmwareUpdate.troubleshooting')}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {['noFile', 'noBoot', 'missingApps', 'noSd', 'binFile'].map(key => (
            <div key={key} className="card bg-base-200 p-4">
              <h4 className="text-sm font-semibold text-base-content/80 mb-1">{t(`firmwareUpdate.troubleshootingItems.${key}.problem`)}</h4>
              <p className="text-xs text-base-content/50 leading-relaxed">{t(`firmwareUpdate.troubleshootingItems.${key}.fix`)}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-base-content/30 mt-4">
          {t('firmwareUpdate.dfuNote')}
        </p>
      </PageSection>
    </>
  );
}
