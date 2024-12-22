import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const initI18n = (resources, fallbackLng = "en") => {
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
