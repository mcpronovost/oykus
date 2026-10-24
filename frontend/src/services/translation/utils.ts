import type { TypeLang, TypeTranslationDict } from "./types";

export const DEFAULT_LANG: TypeLang = "fr";

const localeModules = import.meta.glob<{ default: TypeTranslationDict }>("./locales/**/*.json", {
  eager: true,
});

const buildDictionary = (lang: TypeLang): TypeTranslationDict => {
  const dictionary: TypeTranslationDict = {};

  for (const [path, localeModule] of Object.entries(localeModules)) {
    if (!path.endsWith(`/${lang}.json`)) continue;
    Object.assign(dictionary, localeModule.default);
  }

  return dictionary;
};

const dictionaries = {
  fr: buildDictionary("fr"),
  en: buildDictionary("en"),
} satisfies Record<TypeLang, TypeTranslationDict>;

export const SUPPORTED_LANGS = Object.keys(dictionaries) as TypeLang[];

export const loadTranslations = (lang: TypeLang = DEFAULT_LANG): TypeTranslationDict => dictionaries[lang];
