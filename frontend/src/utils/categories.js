export const OTHER_CATEGORY_LABEL = "other";

export function isOtherCategory(label) {
  return String(label ?? "").trim().toLowerCase() === OTHER_CATEGORY_LABEL;
}

export function sortCategories(categories, getName = (category) => category.label) {
  return [...categories].sort((a, b) => {
    const aOther = isOtherCategory(a.label);
    const bOther = isOtherCategory(b.label);
    if (aOther !== bOther) return aOther ? 1 : -1;
    return String(getName(a)).localeCompare(String(getName(b)), undefined, {
      sensitivity: "base",
    });
  });
}

export function findOtherCategory(categories) {
  return categories.find((category) => isOtherCategory(category.label)) ?? null;
}
