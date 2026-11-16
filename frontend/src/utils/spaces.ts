const SPACE_LOCKED_ROUTE_PREFIXES = ["encyclopedia", "notes"] as const;

export function isSpaceFeatureLockedRoute(routeName: string | undefined) {
  if (!routeName) return false;
  return SPACE_LOCKED_ROUTE_PREFIXES.some(
    (prefix) => routeName === prefix || routeName.startsWith(`${prefix}-`),
  );
}
