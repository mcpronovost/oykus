import { createContext, useContext, useEffect, useRef } from "react";
import { DEFAULT_LANG, loadTranslations } from "./utils";

const TranslationContext = createContext();

export function TranslationProvider({ children, lang = DEFAULT_LANG }) {
  const translationRef = useRef(null);

  useEffect(() => {
    const translation = loadTranslations(lang);
    translationRef.current = translation;
  }, [lang]);

  const handleTranslate = (key, count, vars = {}) => {
    if (!translationRef.current) {
      const translation = loadTranslations(lang);
      translationRef.current = translation;
    }

    const translation = translationRef.current[key];
    if (typeof translation === "object" && count !== undefined) {
      const rules = new Intl.PluralRules(lang);
      const pluralForm = rules.select(count);
      const result = translation[pluralForm] || translation["other"];
      return result.replace(
        /\{(\w+)\}/g,
        (_, varName) => varName === "count" ? count : vars[varName] ?? `{${varName}}`
      );
    }

    if (typeof translation === "object") {
      const result =  translation["other"];
      return result.replace(
        /\{(\w+)\}/g,
        (_, varName) => varName === "count" ? count : vars[varName] ?? `{${varName}}`
      );
    }

    if (typeof translation === "string") {
      return translation.replace(
        /\{(\w+)\}/g,
        (_, varName) => vars[varName] ?? `{${varName}}`
      );
    }

    // eslint-disable-next-line no-console
    // console.warn(`Translation not found for key: "${key}".`);
    return key;
  };

  const value = {
    lang,
    t: handleTranslate,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    window.location.reload();
    return { lang: "fr", t: () => {}};
  }
  return context;
}