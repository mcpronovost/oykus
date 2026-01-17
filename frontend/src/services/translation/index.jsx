import { createContext, useContext, useEffect, useRef } from "react";
import { DEFAULT_LANG, loadTranslations } from "./utils";

const TranslationContext = createContext();

export function TranslationProvider({ children, lang = DEFAULT_LANG }) {
  const translationRef = useRef(null);

  useEffect(() => {
    const translation = loadTranslations(lang);
    translationRef.current = translation;
  }, [lang]);

  const handleTranslate = (key, count) => {
    if (!translationRef.current) {
      const translation = loadTranslations(lang);
      translationRef.current = translation;
    }

    const translation = translationRef.current[key];
    if (typeof translation === "object" && count !== undefined) {
      const rules = new Intl.PluralRules(lang);
      const pluralForm = rules.select(count);
      return translation[pluralForm] || translation["other"];
    }

    if (typeof translation === "object") {
      return translation["other"];
    }

    if (typeof translation === "string") {
      return translation;
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
  return useContext(TranslationContext);
}