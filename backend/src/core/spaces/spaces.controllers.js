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

function parseIdParam(value, label = "id") {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestError("Validation failed", { [label]: ["Required"] });
  }
  return value.trim();
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

export async function remove(req, res) {
  const spaceId = parseIdParam(req.params.id);
  await spacesServices.deleteSpace(req.userId, spaceId);
  res.status(204).send();
}

export async function stats(req, res) {
  const spaceId = parseIdParam(req.params.id);
  const data = await spacesServices.getSpaceStats(req.userId, spaceId);
  res.json({ data });
}
