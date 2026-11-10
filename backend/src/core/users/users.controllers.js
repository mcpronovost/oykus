import { BadRequestError } from "../../shared/errors/index.js";
import { setCurrentSpaceInput } from "./users.inputs.js";
import * as usersServices from "./users.services.js";

function parseBody(schema, body) {
  const { value, errors } = schema(body);
  if (errors) {
    throw new BadRequestError("Validation failed", errors);
  }
  return value;
}

export async function me(req, res) {
  const user = await usersServices.getMe(req.userId);
  res.json({ data: user });
}

export async function setCurrentSpace(req, res) {
  const input = parseBody(setCurrentSpaceInput, req.body ?? {});
  const user = await usersServices.setCurrentSpace(req.userId, input);
  res.json({ data: user });
}
