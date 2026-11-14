import { BadRequestError } from "../../shared/errors/index.js";
import {
  createEncyclopediaEntryInput,
  listEncyclopediaCategoriesInput,
  listEncyclopediaEntriesInput,
  updateEncyclopediaEntryInput,
} from "./encyclopedia.inputs.js";
import * as encyclopediaServices from "./encyclopedia.services.js";

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

export async function listTopics(_req, res) {
  const topics = await encyclopediaServices.listTopics();
  res.json({ data: topics });
}

export async function listCategories(req, res) {
  const input = parseBody(listEncyclopediaCategoriesInput, req.query ?? {});
  const categories = await encyclopediaServices.listCategories(input);
  res.json({ data: categories });
}

export async function list(req, res) {
  const spaceId = parseIdParam(req.params.id, "spaceId");
  const topic = parseIdParam(req.params.topic, "topic");
  const input = parseBody(listEncyclopediaEntriesInput, req.query ?? {});
  const entries = await encyclopediaServices.listEntries(req.userId, {
    spaceId,
    topic,
    category: input.category,
  });
  res.json({ data: entries });
}

export async function get(req, res) {
  const entryId = parseIdParam(req.params.id);
  const entry = await encyclopediaServices.getEntry(req.userId, entryId);
  res.json({ data: entry });
}

export async function create(req, res) {
  const input = parseBody(createEncyclopediaEntryInput, req.body ?? {});
  const entry = await encyclopediaServices.createEntry(req.userId, input);
  res.status(201).json({ data: entry });
}

export async function update(req, res) {
  const entryId = parseIdParam(req.params.id);
  const input = parseBody(updateEncyclopediaEntryInput, req.body ?? {});
  const entry = await encyclopediaServices.updateEntry(req.userId, entryId, input);
  res.json({ data: entry });
}

export async function remove(req, res) {
  const entryId = parseIdParam(req.params.id);
  await encyclopediaServices.deleteEntry(req.userId, entryId);
  res.status(204).send();
}
