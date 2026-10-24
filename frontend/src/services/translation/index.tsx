import type { ReactNode } from "react";
import type {
  TypeLang,
  TypeTranslationDict,
  TypeTranslationVars,
  TypeTranslateFn,
  TypeTranslationRichVars,
  TypeTranslateRichFn,
  TypeTranslationContextValue,
  TypeTranslationProviderProps,
} from "./types";
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { DEFAULT_LANG, loadTranslations } from "./utils";

const TranslationContext = createContext<TypeTranslationContextValue | undefined>(undefined);

const interpolate = (template: string, count: number | undefined, vars: TypeTranslationVars): string =>
  template.replace(/\{(\w+)\}/g, (_, varName: string) =>
    varName === "count" ? String(count) : String(vars[varName] ?? `{${varName}}`),
  );

const interpolateRich = (template: string, count: number | undefined, vars: TypeTranslationRichVars): ReactNode => {
  const parts = template.split(/(\{\w+\})/g);

  return parts.map((part, i) => {
    const match = part.match(/^\{(\w+)\}$/);
    if (!match) return part; // plain text chunk, return as-is

    const varName = match[1];

    if (varName === "count") return String(count);

    const value = vars[varName];
    if (value === undefined) return `{${varName}}`; // same fallback as your interpolate

    return typeof value === "string" || typeof value === "number" ? (
      String(value)
    ) : (
      <React.Fragment key={i}>{value}</React.Fragment>
    );
  });
};

export function TranslationProvider({ children, lang = DEFAULT_LANG }: TypeTranslationProviderProps) {
  const translationRef = useRef<TypeTranslationDict | null>(null);

  useEffect(() => {
    const translation = loadTranslations(lang);
    translationRef.current = translation;
  }, [lang]);

  const handleTranslate: TypeTranslateFn = (key, count, vars = {}) => {
    if (!translationRef.current) {
      translationRef.current = loadTranslations(lang);
    }

    const translation = translationRef.current[key];

    let template: string | undefined;

    if (typeof translation === "object" && count !== undefined) {
      const rules = new Intl.PluralRules(lang);
      const pluralForm = rules.select(count);
      template = (translation[pluralForm] || translation["other"]) as string;
    } else if (typeof translation === "object") {
      template = translation["zero"] as string;
    } else if (typeof translation === "string") {
      template = translation;
    }

    // eslint-disable-next-line no-console
    // console.warn(`Translation not found for key: "${key}".`);

    if (!template) return key;

    return interpolate(template, count, vars);
  };

  const handleRichTranslate: TypeTranslateFn = (key, count, vars = {}) => {
    if (!translationRef.current) {
      translationRef.current = loadTranslations(lang);
    }

    const translation = translationRef.current[key];

    let template: string | undefined;

    if (typeof translation === "object" && count !== undefined) {
      const rules = new Intl.PluralRules(lang);
      const pluralForm = rules.select(count);
      template = (translation[pluralForm] || translation["other"]) as string;
    } else if (typeof translation === "object") {
      template = translation["zero"] as string;
    } else if (typeof translation === "string") {
      template = translation;
    }

    // eslint-disable-next-line no-console
    // console.warn(`Translation not found for key: "${key}".`);

    if (!template) return key;

    return interpolateRich(template, count, vars);
  };

  const value = useMemo<TypeTranslationContextValue>(
    () => ({
      lang,
      t: handleTranslate,
      tNode: handleRichTranslate,
    }),
    [lang],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation(): TypeTranslationContextValue {
  const context = useContext(TranslationContext);
  if (!context) {
    window.location.reload();
    return { lang: "fr", t: () => "", tNode: () => "" };
  }
  return context;
}