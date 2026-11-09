import { BadRequestError } from "../../shared/errors/index.js";
import { createSpaceInput } from "./spaces.inputs.js";
import * as spacesServices from "./spaces.services.js";

function parseBody(schema, body) {
  const { value, errors } = schema(body);
  if (errors) {
    throw new BadRequestError("Validation failed", errors);
  }
  return value;
}

export async function list(req, res) {
  const spaces = await spacesServices.listSpaces(req.userId);
  res.json({ data: spaces });
}

export async function create(req, res) {
  const input = parseBody(createSpaceInput, req.body ?? {});
  const space = await spacesServices.createSpace(req.userId, input);
  res.status(201).json({ data: space });
}
