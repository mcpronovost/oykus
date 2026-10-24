import type { ReactNode } from "react";

export type TypeLang = "fr" | "en";

export interface TypeTranslationDict {
  [key: string]: string | TypeTranslationDict;
}

export interface TypeTranslationFile {
  path: string;
  translations: TypeTranslationDict;
}

export type TypeTranslationVars = Record<string, string | number>;

export type TypeTranslateFn = (key: string, count?: number, vars?: TypeTranslationVars) => string;

export type TypeTranslationRichVars = Record<string, string | number | ReactNode>;

export type TypeTranslateRichFn = (key: string, count?: number, vars?: TypeTranslationRichVars) => ReactNode;

export interface TypeTranslationContextValue {
  lang: TypeLang;
  t: TypeTranslateFn;
  tNode: TypeTranslateRichFn;
}

export interface TypeTranslationProviderProps {
  children: ReactNode;
  lang?: TypeLang;
}