import { DEFAULT_LANG, SUPPORTED_LANGS } from "@/services/translation/utils";
import { ROUTES } from "./routes";

export const getLangFromPath = (pathname) => {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  return match && SUPPORTED_LANGS.includes(match[1])
    ? match[1]
    : DEFAULT_LANG;
};

export const getUniverseSlugFromPath = (pathname) => {
  const match = pathname.match(/\/-\/([a-z0-9-]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Recursive function to find route in nested structure
const findRouteRecursive = (routes, pathSegments, pathlang) => {
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
      const params = {};

      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const actualSegment = matchingSegments[i];

        // Build a regex from the route segment, replacing {paramName} with named capture groups
        const paramNames = [];
        const regexStr = routeSegment.replace(/\{(\w+)\}/g, (_, name) => {
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

export const findRoute = (pathname, pathlang) => {
  const path = pathname.replace(/^\/(fr|en)/, "").replace(/^\//, "");
  const pathSegments = path.split("/").filter(segment => segment.length > 0);
  
  // Special case: if path is empty (root route), check for routes with empty paths first
  if (pathSegments.length === 0) {
    const rootRoute = ROUTES.find(route => route.paths[pathlang] === "");
    if (rootRoute) {
      const result = { route: rootRoute, params: { ...rootRoute.params} };
      return result;
    };
  }
  
  return findRouteRecursive(ROUTES, pathSegments, pathlang);
};

// Helper function to build full path for a route including parent routes
export const buildRoutePath = (routeName, params = {}, pathlang) => {
  const findRoutePath = (routes, name, currentPath = "") => {
    for (const route of routes) {
      const routePath = route.paths[pathlang];
      if (routePath === undefined) continue;
      
      const fullPath = currentPath ? `${currentPath}/${routePath}` : routePath;
      
      if (route.name === name) {
        // Replace dynamic parameters in the full path
        let finalPath = fullPath;
        Object.keys(params).forEach(key => {
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
export const getBreadcrumbs = (routeName, pathlang) => {
  const breadcrumbs = [];

  const findBreadcrumbs = (routes, name, currentPath = "") => {
    for (const route of routes) {
      const routePath = route.paths[pathlang];
      const routeLabel = route.labels?.[pathlang] || route.name;
      if (routePath === undefined) continue;

      const fullPath = currentPath ? `${currentPath}/${routePath}` : routePath;

      if (route.name === name) {
        breadcrumbs.push({ name: route.name, path: fullPath, label: routeLabel });
        return true;
      }

      if (route.children) {
        breadcrumbs.push({ name: route.name, path: fullPath, label: routeLabel });
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