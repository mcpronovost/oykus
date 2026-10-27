import type { TypeLang } from "@/services/translation/types";
import type {
  TypeRoute,
  TypeRouteParams,
  TypeRouteResult,
  TypeRouterContextValue,
  TypeRouterProviderProps,
} from "./types";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/services/auth";
import { ROUTES } from "./routes";
import { buildLocalizedPath, buildRoutePath, findRoute, getBreadcrumbs, getLangFromPath } from "./utils";

const RouterContext = createContext<TypeRouterContextValue | undefined>(undefined);

const initialRouteResult: TypeRouteResult | null = findRoute(
  window.location.pathname,
  getLangFromPath(window.location.pathname),
  false,
);

const INITIAL_STATE: TypeRouterContextValue = {
  history: [window.location.pathname],
  lang: getLangFromPath(window.location.pathname),
  route: initialRouteResult?.route || null,
  params: initialRouteResult?.params || {},
  n: () => {},
  breads: () => [],
  routeTitle: () => "",
  refresh: () => {
    window.location.reload();
  },
};

export function RouterProvider({ children }: TypeRouterProviderProps) {
  const { isAuth } = useAuth();
  const [history, setHistory] = useState<string[]>(INITIAL_STATE.history);
  const [lang, setLang] = useState<TypeLang>(INITIAL_STATE.lang);
  const [route, setRoute] = useState<TypeRoute | null>(INITIAL_STATE.route);
  const [params, setParams] = useState<TypeRouteParams>(INITIAL_STATE.params);

  const applyRouteResult = (pathname: string, language: TypeLang, authenticated: boolean) => {
    const routeResult: TypeRouteResult | null = findRoute(pathname, language, authenticated);
    setLang(language);
    setRoute(routeResult?.route || null);
    setParams(routeResult?.params || {});
  };

  const navigate = (name: string, routeParams: TypeRouteParams = {}, language: TypeLang = lang) => {
    const routePath = buildRoutePath(name, routeParams, language);
    if (routePath === null || routePath === undefined) {
      const fallbackRoute = ROUTES.find((routeItem: TypeRoute) => routeItem.name === "404");
      const fallbackPath = fallbackRoute?.paths[language];
      if (fallbackRoute && fallbackPath !== undefined) {
        const nextPath = buildLocalizedPath(fallbackPath, language);
        window.history.pushState({}, "", nextPath);
        setHistory((current) => [...current, nextPath]);
        applyRouteResult(nextPath, language, isAuth);
      }
      return;
    }

    const nextPath = buildLocalizedPath(routePath, language);
    window.history.pushState({}, "", nextPath);
    setHistory((current) => [...current, nextPath]);
    applyRouteResult(nextPath, language, isAuth);
  };

  const refresh = () => {
    window.location.reload();
  };

  const routeTitle = (title?: string) => {
    const appName = "Kotan";
    if (title) return (window.document.title = `${title} | ${appName}`);
    return (window.document.title = appName);
  };

  const breads = (name: string, language: TypeLang = lang) => getBreadcrumbs(name, language);

  useEffect(() => {
    if (window.document.documentElement.lang !== lang) {
      window.document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    applyRouteResult(window.location.pathname, getLangFromPath(window.location.pathname), isAuth);
  }, [isAuth]);

  useEffect(() => {
    const onPopState = () => {
      const newLang = getLangFromPath(window.location.pathname);
      applyRouteResult(window.location.pathname, newLang, isAuth);
      setHistory((h) => [...h, window.location.pathname]);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isAuth]);

  return (
    <RouterContext.Provider value={{ route, params, lang, history, breads, n: navigate, routeTitle, refresh }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): TypeRouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    window.location.reload();
    return INITIAL_STATE;
  }
  return context;
}
