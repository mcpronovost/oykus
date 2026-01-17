import { ROUTES } from "./routes";

export const getLangFromPath = (pathname) => {
  const match = pathname.match(/^\/(fr|en)(\/|$)/);
  return match ? match[1] : "fr";
};

// Helper function to match dynamic path segments
const matchPathSegment = (routePath, actualPath) => {
  if (routePath === actualPath) return true;
  
  // Handle dynamic segments like {worldSlug}
  const routeSegments = routePath.split("/");
  const actualSegments = actualPath.split("/");
  
  if (routeSegments.length !== actualSegments.length) return false;
  
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const actualSegment = actualSegments[i];
    
    // If it's a dynamic segment (wrapped in {})
    if (routeSegment.startsWith("{") && routeSegment.endsWith("}")) {
      continue; // Dynamic segment matches anything
    }
    
    // Static segments must match exactly
    if (routeSegment !== actualSegment) {
      return false;
    }
  }
  
  return true;
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
    
    // Check if this route matches the beginning of the path
    if (pathSegments.length >= routeSegments.length) {
      const matchingSegments = pathSegments.slice(0, routeSegments.length);
      const remainingSegments = pathSegments.slice(routeSegments.length);
      
      // Check if the route segments match (including dynamic segments)
      let matches = true;
      const params = {};
      
      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const actualSegment = matchingSegments[i];
        
        // If it's a dynamic segment (wrapped in {})
        if (routeSegment.startsWith("{") && routeSegment.endsWith("}")) {
          // Extract parameter name and value
          const paramName = routeSegment.slice(1, -1); // Remove { and }
          params[paramName] = actualSegment;
          continue; // Dynamic segment matches anything
        }
        
        // Static segments must match exactly
        if (routeSegment !== actualSegment) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        // If we have children and more path segments, search in children
        if (route.children && remainingSegments.length > 0) {
          const childResult = findRouteRecursive(route.children, remainingSegments, pathlang);
          if (childResult) {
            // Merge parent and child parameters
            return {
              route: childResult.route,
              params: { ...params, ...childResult.params, ...childResult.route.params }
            };
          }
        }
        
        // If no children or no more segments, return this route with params
        return { route, params: { ...route.params, ...params} };
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