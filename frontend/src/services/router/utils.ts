import type { TypeLang } from "@/services/translation/types";
import type { TypeRoute, TypeRouteParams, TypeRouteResult, TypeBreadcrumb } from "./types";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "@/services/translation/utils";
import { ROUTES } from "./routes";

const isSupportedLang = (value: string): value is TypeLang => SUPPORTED_LANGS.some((lang) => lang === value);

const matchLangPrefix = (pathname: string): { code: string; prefix: string } | null => {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (!match) return null;
  return { code: match[1], prefix: match[0] };
};

// --- Functions ---------------------------------------------------------------

export const getLangFromPath = (pathname: string): TypeLang => {
  const match = matchLangPrefix(pathname);
  return match && isSupportedLang(match.code) ? match.code : DEFAULT_LANG;
};

export const buildLocalizedPath = (routePath: string, lang: TypeLang): string => {
  const trimmed = routePath.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${lang}/${trimmed}` : `/${lang}`;
};

export const getUniverseSlugFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/-\/([a-z0-9-]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Recursive function to find route in nested structure
const findRouteRecursive = (routes: TypeRoute[], pathSegments: string[], pathlang: TypeLang): TypeRouteResult | null => {
  for (const route of routes) {
    const routePath = route.paths[pathlang];
    if (routePath === undefined) continue;

    // Handle empty path (root route)
    if (routePath === "") {
      if (pathSegments.length === 0) {
        return { route, params: {} };
      }
      continue;
    }

    const routeSegments = routePath.split("/");

    if (pathSegments.length >= routeSegments.length) {
      const matchingSegments = pathSegments.slice(0, routeSegments.length);
      const remainingSegments = pathSegments.slice(routeSegments.length);

      let matches = true;
      const params: TypeRouteParams = {};

      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const actualSegment = matchingSegments[i];

        // Build a regex from the route segment, replacing {paramName} with named capture groups
        const paramNames: string[] = [];
        const regexStr = routeSegment.replace(/\{(\w+)\}/g, (_, name: string) => {
          paramNames.push(name);
          return "([^/]+)"; // Match anything except a slash
        });

        if (paramNames.length > 0) {
          // Dynamic segment — test with regex and extract named params
          const regex = new RegExp(`^${regexStr}$`);
          const match = actualSegment.match(regex);

          if (!match) {
            matches = false;
            break;
          }

          paramNames.forEach((name, idx) => {
            params[name] = match[idx + 1];
          });
        } else {
          // Static segment — must match exactly
          if (routeSegment !== actualSegment) {
            matches = false;
            break;
          }
        }
      }

      if (matches) {
        if (route.children && remainingSegments.length > 0) {
          const childResult = findRouteRecursive(route.children, remainingSegments, pathlang);
          if (childResult) {
            return {
              route: childResult.route,
              params: { ...params, ...childResult.params, ...childResult.route.params },
            };
          }
        }

        return { route, params: { ...route.params, ...params } };
      }
    }
  }

  return null;
};

export const findRoute = (pathname: string, pathlang: TypeLang): TypeRouteResult | null => {
  const match = matchLangPrefix(pathname);
  const path = (match && isSupportedLang(match.code) ? pathname.slice(match.prefix.length) : pathname).replace(/^\//, "");
  const pathSegments = path.split("/").filter((segment) => segment.length > 0);

  // Special case: if path is empty (root route), check for routes with empty paths first
  if (pathSegments.length === 0) {
    const rootRoute = ROUTES.find((route: TypeRoute) => route.paths[pathlang] === "");
    if (rootRoute) {
      const result: TypeRouteResult = { route: rootRoute, params: { ...rootRoute.params } };
      return result;
    }
  }

  return findRouteRecursive(ROUTES, pathSegments, pathlang);
};

// Helper function to build full path for a route including parent routes
export const buildRoutePath = (routeName: string, params: TypeRouteParams = {}, pathlang: TypeLang): string | null => {
  const findRoutePath = (routes: TypeRoute[], name: string, currentPath = ""): string | null => {
    for (const route of routes) {
      const routePath = route.paths[pathlang];
      if (routePath === undefined) continue;

      const fullPath = currentPath ? `${currentPath}/${routePath}` : routePath;

      if (route.name === name) {
        // Replace dynamic parameters in the full path
        let finalPath = fullPath;
        Object.keys(params).forEach((key) => {
          finalPath = finalPath.replace(`{${key}}`, params[key]);
        });
        return finalPath;
      }

      if (route.children) {
        const childPath = findRoutePath(route.children, name, fullPath);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  return findRoutePath(ROUTES, routeName);
};

// Function to generate breadcrumbs from a route name
export const getBreadcrumbs = (routeName: string, pathlang: TypeLang): TypeBreadcrumb[] => {
  const breadcrumbs: TypeBreadcrumb[] = [];

  const findBreadcrumbs = (routes: TypeRoute[], name: string, currentPath = ""): boolean => {
    for (const route of routes) {
      const routePath = route.paths[pathlang];
      const routeLabel = route.labels?.[pathlang] || route.name;
      if (routePath === undefined) continue;

      const fullPath = currentPath ? `${currentPath}/${routePath}` : routePath;

      if (route.name === name) {
        breadcrumbs.push({ name: route.name, path: buildLocalizedPath(fullPath, pathlang), label: routeLabel });
        return true;
      }

      if (route.children) {
        breadcrumbs.push({ name: route.name, path: buildLocalizedPath(fullPath, pathlang), label: routeLabel });
        const found = findBreadcrumbs(route.children, name, fullPath);
        if (found) return true;
        breadcrumbs.pop(); // Remove if not part of the trail
      }
    }
    return false;
  };

  findBreadcrumbs(ROUTES, routeName);
  return breadcrumbs;
};