import { createContext, useContext, useState, useCallback, useEffect } from "react";

import { DEFAULT_LANG, SUPPORTED_LANGS } from "@/services/translation/utils";
import { ROUTES } from "./routes";
import { getLangFromPath, findRoute, buildRoutePath, getBreadcrumbs } from "./utils";

const RouterContext = createContext();

const initialRouteResult = findRoute(window.location.pathname, getLangFromPath(window.location.pathname));

const INITIAL_STATE = {
  history: [window.location.pathname],
  lang: getLangFromPath(window.location.pathname),
  route: initialRouteResult?.route || null,
  params: initialRouteResult?.params || {},
  n: () => {},
  refresh: () => {
    window.location.reload();
  },
};

export function RouterProvider({ children }) {
  const [history, setHistory] = useState(INITIAL_STATE.history);
  const [lang, setLang] = useState(INITIAL_STATE.lang);
  const [route, setRoute] = useState(INITIAL_STATE.route);
  const [params, setParams] = useState(INITIAL_STATE.params);

  if (route === null && !SUPPORTED_LANGS.some(l => window.location.pathname.startsWith(`/${l}`))) {
    window.location.pathname=`/${DEFAULT_LANG}${window.location.pathname}`;
    return null;
  }

  const navigate = useCallback(
    (name, params = {}, language = lang) => {
      // Build the full path for the route
      const routePath = buildRoutePath(name, params, language);
      if (routePath === null || routePath === undefined) {
        // Fallback to 404 if route not found
        const fallbackRoute = ROUTES.find((r) => r.name === "404");
        if (fallbackRoute) {
          const newPath = `/${language}/${fallbackRoute.paths[language]}`;
          window.history.pushState({}, "", newPath);
          setHistory((h) => [...h, newPath]);
          setLang(language);
          setRoute(fallbackRoute);
        }
        return;
      }

      const newPath = `/${language}/${routePath}`;
      window.history.pushState({}, "", newPath);
      setHistory((h) => [...h, newPath]);
      setLang(language);

      // Find and set the actual route
      const routeResult = findRoute(newPath, language);
      setRoute(routeResult?.route || null);
      setParams(routeResult?.params || {});
    },
    [lang]
  );

  const refresh = useCallback(() => {
    window.location.reload();
  }, [lang, route]);

  const changePageTitle = useCallback((title) => {
    const universeName = "Oykus";
    if (title) return window.document.title = `${title} | ${universeName}`;
    return window.document.title = universeName;
  }, []);

  useEffect(() => {
    if (window.document.documentElement.lang !== lang) {
      window.document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    const onPopState = () => {
      const newLang = getLangFromPath(window.location.pathname);
      const routeResult = findRoute(window.location.pathname, newLang);
      setLang(newLang);
      setRoute(routeResult?.route || null);
      setParams(routeResult?.params || {});
      setHistory((h) => [...h, window.location.pathname]);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = {
    route,
    params,
    lang,
    history,
    breads: (name, language = lang) => getBreadcrumbs(name, language),
    n: (name, params = {}, language = lang) => navigate(name, params, language),
    routeTitle: (title) => changePageTitle(title),
    refresh,
  };

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    window.location.reload();
    return INITIAL_STATE;
  }
  return context;
}