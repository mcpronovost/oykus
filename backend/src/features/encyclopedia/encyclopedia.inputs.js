import { number, object, string } from "../../shared/validate.js";

export const listEncyclopediaEntriesInput = object({
  category: string({ required: false, min: 1, max: 100 }),
});

export const listEncyclopediaCategoriesInput = object({
  topic: string({ required: true, min: 1, max: 100 }),
});

export const createEncyclopediaEntryInput = object({
  title: string({ required: true, min: 1, max: 200 }),
  spaceId: string({ required: true, min: 1, max: 36 }),
  topic: string({ required: true, min: 1, max: 100 }),
  categoryId: number({ required: false, integer: true, min: 1 }),
  summary: string({ required: false, min: 1, max: 2000 }),
  slug: string({ required: false, min: 1, max: 200 }),
});

export const updateEncyclopediaEntryInput = object({
  title: string({ required: false, min: 1, max: 200 }),
  categoryId: number({ required: false, integer: true, min: 1 }),
  summary: string({ required: false, min: 0, max: 2000 }),
  slug: string({ required: false, min: 1, max: 200 }),
});
