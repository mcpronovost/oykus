import { number, object, string, uuid } from "../../shared/validate.js";

export const createNoteInput = object({
  content: string({ required: true, min: 1, max: 20000 }),
  spaceId: uuid(),
  categoryId: number({ required: false, integer: true, min: 1 }),
});

export const updateNoteInput = object({
  content: string({ required: false, min: 1, max: 20000 }),
  categoryId: number({ required: false, integer: true, min: 1 }),
});

export const createNoteCategoryInput = object({
  label: string({ required: true, min: 1, max: 100 }),
});

export const updateNoteCategoryInput = object({
  label: string({ required: true, min: 1, max: 100 }),
});
