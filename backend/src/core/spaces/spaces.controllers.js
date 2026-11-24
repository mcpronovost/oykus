import { BadRequestError } from "../../shared/errors/index.js";
import { parseLimit } from "../../shared/pagination.js";
import { decodeWebpBase64 } from "../../shared/uploads.js";
import { isUuid } from "../../shared/validate.js";
import { listSpaceLogs } from "./spaces.activity.js";
import {
  createSpaceInput,
  setSpaceActiveInput,
  updateSpaceCoverInput,
  updateSpaceInput,
} from "./spaces.inputs.js";
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

export async function update(req, res) {
  const spaceId = parseIdParam(req.params.id);
  const input = parseBody(updateSpaceInput, req.body ?? {});

  if (input.name === undefined && input.description === undefined) {
    throw new BadRequestError("Validation failed", {
      _form: ["At least one field is required"],
    });
  }

  const space = await spacesServices.updateSpace(req.userId, spaceId, input);
  res.json({ data: space });
}

export async function setActive(req, res) {
  const spaceId = parseIdParam(req.params.id);
  const input = parseBody(setSpaceActiveInput, req.body ?? {});
  const space = await spacesServices.setSpaceActive(
    req.userId,
    spaceId,
    input.isActive,
  );
  res.json({ data: space });
}

export async function updateCover(req, res) {
  const spaceId = parseIdParam(req.params.id);
  const input = parseBody(updateSpaceCoverInput, req.body ?? {});
  const decoded = decodeWebpBase64(input.data);

  if (decoded.error) {
    throw new BadRequestError("Validation failed", { data: [decoded.error] });
  }

  const space = await spacesServices.updateSpaceCover(
    req.userId,
    spaceId,
    decoded.buffer,
  );
  res.json({ data: space });
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

export async function logs(req, res) {
  const spaceId = parseIdParam(req.params.id);
  if (!isUuid(spaceId)) {
    throw new BadRequestError("Validation failed", { id: ["Must be a UUID"] });
  }
  const limit = parseLimit(req.query.limit, 10);
  const data = await listSpaceLogs(spaceId, req.userId, limit);
  res.json({ data });
}
