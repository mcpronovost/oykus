import { email, object, string } from "../../shared/validate.js";

export const loginInput = object({
  username: string({ required: true, min: 3, max: 32 }),
  password: string({ required: true, min: 1, max: 200, trim: false }),
});

export const registerInput = object({
  username: string({ required: true, min: 3, max: 32 }),
  email: email({ required: true, max: 254 }),
  password: string({ required: true, min: 8, max: 200, trim: false }),
  name: string({ required: true, min: 1, max: 100 }),
});
