import type { LazyExoticComponent, ComponentType, ReactNode } from "react";
import type { TypeLang } from "@/services/translation/types";

export type TypeRouteParams = Record<string, string>;

export interface TypeRoute {
  name: string;
  component: LazyExoticComponent<ComponentType<any>>;
  paths: Partial<Record<TypeLang, string>>;
  labels?: Partial<Record<TypeLang, string>>;
  params?: TypeRouteParams;
  children?: TypeRoute[];
}

export interface TypeRouteResult {
  route: TypeRoute;
  params: TypeRouteParams;
}

export interface TypeBreadcrumb {
  name: string;
  path: string;
  label: string;
}

export interface TypeRouterContextValue {
  route: TypeRoute | null;
  params: TypeRouteParams;
  lang: TypeLang;
  history: string[];
  breads: (name: string, language?: TypeLang) => TypeBreadcrumb[];
  n: (name: string, params?: TypeRouteParams, language?: TypeLang) => void;
  routeTitle: (title?: string) => string;
  refresh: () => void;
}

export interface TypeRouterProviderProps {
  children: ReactNode;
}