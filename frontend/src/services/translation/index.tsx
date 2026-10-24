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
import { Fragment, createContext, useContext } from "react";
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
      <Fragment key={i}>{value}</Fragment>
    );
  });
};

const getTemplate = (
  translations: TypeTranslationDict,
  lang: TypeLang,
  key: string,
  count: number | undefined,
): string | undefined => {
  const translation = translations[key];

  if (typeof translation === "object" && count !== undefined) {
    const pluralForm = new Intl.PluralRules(lang).select(count);
    const template = translation[pluralForm] || translation.other;
    return typeof template === "string" ? template : undefined;
  }

  if (typeof translation === "object") {
    return typeof translation.zero === "string" ? translation.zero : undefined;
  }

  return translation;
};

export function TranslationProvider({ children, lang = DEFAULT_LANG }: TypeTranslationProviderProps) {
  const translations = loadTranslations(lang);

  const t: TypeTranslateFn = (key, count, vars = {}) => {
    const template = getTemplate(translations, lang, key, count);
    if (!template) return key;
    return interpolate(template, count, vars);
  };

  const tNode: TypeTranslateRichFn = (key, count, vars = {}) => {
    const template = getTemplate(translations, lang, key, count);
    if (!template) return key;
    return interpolateRich(template, count, vars);
  };

  return <TranslationContext.Provider value={{ lang, t, tNode }}>{children}</TranslationContext.Provider>;
}

export function useTranslation(): TypeTranslationContextValue {
  const context = useContext(TranslationContext);
  if (!context) {
    window.location.reload();
    return { lang: "fr", t: () => "", tNode: () => "" };
  }
  return context;
}