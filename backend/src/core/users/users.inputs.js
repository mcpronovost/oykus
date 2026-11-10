import { object, string } from "../../shared/validate.js";

export const setCurrentSpaceInput = object({
  spaceId: string({ required: true, min: 1, max: 36 }),
});
