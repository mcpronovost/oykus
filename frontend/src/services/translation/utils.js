export const DEFAULT_LANG = "fr";

export const getTranslationFiles = (lang = DEFAULT_LANG) => {
  const files = import.meta.glob("./locales/**/*.json", { eager: true });
  return Object.entries(files)
    .filter(([path]) => path.endsWith(`${lang}.json`))
    .map(([path, module]) => ({
      path,
      translations: module.default,
    }));
};

export const loadTranslations = (lang = DEFAULT_LANG) => {
  const translations = {};

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