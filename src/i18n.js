import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale files
import en from '../locales/en.json';
import cs from '../locales/cs.json';
import da from '../locales/da.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import fi from '../locales/fi.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import ja from '../locales/ja.json';
import nl from '../locales/nl.json';
import pt from '../locales/pt.json';
import ptBR from '../locales/pt-BR.json';
import sv from '../locales/sv.json';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'cs', label: 'Čeština' },
  { code: 'da', label: 'Dansk' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fi', label: 'Suomi' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pt', label: 'Português' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'sv', label: 'Svenska' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      cs: { translation: cs },
      da: { translation: da },
      de: { translation: de },
      es: { translation: es },
      fi: { translation: fi },
      fr: { translation: fr },
      it: { translation: it },
      ja: { translation: ja },
      nl: { translation: nl },
      pt: { translation: pt },
      'pt-BR': { translation: ptBR },
      sv: { translation: sv },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'fm-language',
      caches: ['localStorage'],
    },
  });

export default i18n;
