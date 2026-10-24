import type { TypeLang, TypeTranslationDict, TypeTranslationFile } from "./types";

export const DEFAULT_LANG: TypeLang = "fr";
export const SUPPORTED_LANGS: TypeLang[] = ["fr", "en"];

export const getTranslationFiles = (lang: TypeLang = DEFAULT_LANG): TypeTranslationFile[] => {
  const files = import.meta.glob<{ default: TypeTranslationDict }>("./locales/**/*.json", {
    eager: true,
  });
  return Object.entries(files)
    .filter(([path]) => path.endsWith(`${lang}.json`))
    .map(([path, module]) => ({
      path,
      translations: module.default,
    }));
};

export const loadTranslations = (lang: TypeLang = DEFAULT_LANG): TypeTranslationDict => {
  const translations: TypeTranslationDict = {};
  try {
    const files = getTranslationFiles(lang);
    // Merge all translation files
    files.forEach(({ translations: fileTranslations }) => {
      Object.assign(translations, fileTranslations);
    });
  } catch (error) {
    console.warn(`Failed to load translations for ${lang}:`, error);
  }
  return translations;
};