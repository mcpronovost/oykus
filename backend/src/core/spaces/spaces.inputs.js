import { object, string } from "../../shared/validate.js";

export const createSpaceInput = object({
  name: string({ required: true, min: 1, max: 100 }),
  description: string({ required: false, max: 500 }),
});
