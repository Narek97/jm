// src/i18n.ts
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";

i18n
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n to react-i18next
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already handles escaping
    },
    resources: {
      en: { translation: enTranslation },
    },
  });

export default i18n;
