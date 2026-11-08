export const NOTE_CATEGORY_OUTPUT_SELECT = {
  id: true,
  label: true,
};

export const NOTE_OUTPUT_SELECT = {
  id: true,
  content: true,
  categoryId: true,
  spaceId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: NOTE_CATEGORY_OUTPUT_SELECT,
  },
};

export function toNoteCategoryOutput(category) {
  return {
    id: category.id,
    label: category.label,
  };
}

export function toNoteOutput(note) {
  return {
    id: note.id,
    content: note.content,
    categoryId: note.categoryId,
    category: note.category ? toNoteCategoryOutput(note.category) : null,
    spaceId: note.spaceId,
    userId: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}
