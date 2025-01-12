import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Imoport date adapter locales
import "dayjs/locale/es";
import "dayjs/locale/en-gb";
import "dayjs/locale/de";

// Import our locales
import en from "../locals/en.json";
import es from "../locals/es.json";
import de from "../locals/de.json";

export const initI18n = (resources, fallbackLng = "en-GB") => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: resources,
      fallbackLng,
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export const initialiseI18n = () => {
  initI18n({
    en,
    es,
    de,
  });
};

export const availableLanguages = [
  { code: "en-GB", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
];
