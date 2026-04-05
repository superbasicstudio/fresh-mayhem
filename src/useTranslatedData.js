import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FALLBACK_VERSION } from '../data/firmware';

/**
 * Hook that returns data arrays with translated fields merged in.
 * Falls back to original English content if translation is missing.
 */
export function useTranslatedApps(apps, dataKey) {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    if (i18n.language === 'en') return apps;
    return apps.map(app => {
      const prefix = `data.${dataKey}.${app.name}`;
      const translated = {};
      if (t(`${prefix}.description`, { defaultValue: '' })) translated.description = t(`${prefix}.description`);
      if (t(`${prefix}.legal`, { defaultValue: '' })) translated.legal = t(`${prefix}.legal`);
      if (t(`${prefix}.learn`, { defaultValue: '' })) translated.learn = t(`${prefix}.learn`);
      return { ...app, ...translated };
    });
  }, [apps, dataKey, t, i18n.language]);
}

export function useTranslatedVendors(vendors) {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    if (i18n.language === 'en') return vendors;
    return vendors.map(v => {
      const prefix = `data.vendors.${v.name}`;
      const translated = {};
      if (t(`${prefix}.description`, { defaultValue: '' })) translated.description = t(`${prefix}.description`);
      if (t(`${prefix}.note`, { defaultValue: '' })) translated.note = t(`${prefix}.note`);
      return { ...v, ...translated };
    });
  }, [vendors, t, i18n.language]);
}

export function useTranslatedBuyingTips(tips) {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    if (i18n.language === 'en') return tips;
    return tips.map((tip, i) => {
      const prefix = `data.buyingTips.${i}`;
      const translated = {};
      if (t(`${prefix}.title`, { defaultValue: '' })) translated.title = t(`${prefix}.title`);
      if (t(`${prefix}.description`, { defaultValue: '' })) translated.description = t(`${prefix}.description`);
      return { ...tip, ...translated };
    });
  }, [tips, t, i18n.language]);
}

export function useTranslatedQuickStart(steps) {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    if (i18n.language === 'en') return steps;
    return steps.map((step, i) => {
      const textKey = `data.quickStartSteps.s${i + 1}`;
      const sectionKey = step.section ? `quickstart.sections.${
        step.section === 'Before You Power On' ? 'beforePowerOn' :
        step.section === 'First Power-On' ? 'firstPowerOn' :
        step.section === 'Your First FM Receive' ? 'firstReceive' :
        step.section === 'Frequency Calibration' ? 'calibration' :
        step.section === 'Safety & Shutdown' ? 'safetyShutdown' : ''
      }` : null;
      return {
        ...step,
        text: t(textKey, { defaultValue: step.text, version: FALLBACK_VERSION }),
        section: sectionKey ? t(sectionKey, { defaultValue: step.section }) : step.section,
      };
    });
  }, [steps, t, i18n.language]);
}

export function useTranslatedSafety(safety) {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    if (i18n.language === 'en') return safety;
    const translated = { ...safety };

    if (safety.mistakes) {
      translated.mistakes = safety.mistakes.map(m => {
        const prefix = `data.safety.mistakes.${m.title}`;
        return {
          ...m,
          description: t(`${prefix}.description`, { defaultValue: m.description }),
          symptoms: m.symptoms?.map((s, i) => t(`${prefix}.symptoms.${i}`, { defaultValue: s })) || m.symptoms,
          prevention: m.prevention?.map((p, i) => t(`${prefix}.prevention.${i}`, { defaultValue: p })) || m.prevention,
          technical: t(`${prefix}.technical`, { defaultValue: m.technical }),
        };
      });
    }

    if (safety.damageStories) {
      translated.damageStories = safety.damageStories.map(s => {
        const prefix = `data.safety.damageStories.${s.title}`;
        return {
          ...s,
          description: t(`${prefix}.description`, { defaultValue: s.description }),
          source: t(`${prefix}.source`, { defaultValue: s.source }),
        };
      });
    }

    return translated;
  }, [safety, t, i18n.language]);
}
