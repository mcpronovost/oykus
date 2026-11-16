import { boolean, object, string } from "../../shared/validate.js";

export const createSpaceInput = object({
  name: string({ required: true, min: 1, max: 100 }),
  description: string({ required: false, max: 500 }),
});

export const updateSpaceInput = object({
  name: string({ required: false, min: 1, max: 100 }),
  description: string({ required: false, max: 500 }),
});

export const setSpaceActiveInput = object({
  isActive: boolean({ required: true }),
});

export const updateSpaceCoverInput = object({
  data: string({ required: true, trim: false, min: 1, max: 2_000_000 }),
});
