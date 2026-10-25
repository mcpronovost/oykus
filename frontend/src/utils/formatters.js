export function oykClass(...classes) {
  return classes.filter(Boolean).join(" ");
}