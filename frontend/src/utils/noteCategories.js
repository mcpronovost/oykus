export const OTHER_NOTE_CATEGORY_LABEL = "other";

export function isOtherNoteCategory(label) {
  return String(label ?? "").trim().toLowerCase() === OTHER_NOTE_CATEGORY_LABEL;
}

export function sortNoteCategories(categories, getName = (category) => category.label) {
  return [...categories].sort((a, b) => {
    const aOther = isOtherNoteCategory(a.label);
    const bOther = isOtherNoteCategory(b.label);
    if (aOther !== bOther) return aOther ? 1 : -1;
    return String(getName(a)).localeCompare(String(getName(b)), undefined, {
      sensitivity: "base",
    });
  });
}

export function findOtherNoteCategory(categories) {
  return categories.find((category) => isOtherNoteCategory(category.label)) ?? null;
}
