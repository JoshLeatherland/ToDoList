import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import "dayjs/locale/es";
import "dayjs/locale/en-gb";

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
