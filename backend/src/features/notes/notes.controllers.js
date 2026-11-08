import { BadRequestError } from "../../shared/errors/index.js";
import {
  createNoteCategoryInput,
  createNoteInput,
  listNotesInput,
  updateNoteCategoryInput,
  updateNoteInput,
} from "./notes.inputs.js";
import * as notesServices from "./notes.services.js";

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

function parseCategoryIdParam(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new BadRequestError("Validation failed", {
      id: ["Must be a positive integer"],
    });
  }
  return id;
}

export async function list(req, res) {
  const input = parseBody(listNotesInput, req.query ?? {});
  const notes = await notesServices.listNotes(req.userId, input);
  res.json({ data: notes });
}

export async function get(req, res) {
  const noteId = parseIdParam(req.params.id);
  const note = await notesServices.getNote(req.userId, noteId);
  res.json({ data: note });
}

export async function create(req, res) {
  const input = parseBody(createNoteInput, req.body ?? {});
  const note = await notesServices.createNote(req.userId, input);
  res.status(201).json({ data: note });
}

export async function update(req, res) {
  const noteId = parseIdParam(req.params.id);
  const input = parseBody(updateNoteInput, req.body ?? {});
  const note = await notesServices.updateNote(req.userId, noteId, input);
  res.json({ data: note });
}

export async function remove(req, res) {
  const noteId = parseIdParam(req.params.id);
  await notesServices.deleteNote(req.userId, noteId);
  res.status(204).send();
}

export async function listCategories(_req, res) {
  const categories = await notesServices.listCategories();
  res.json({ data: categories });
}

export async function createCategory(req, res) {
  const input = parseBody(createNoteCategoryInput, req.body ?? {});
  const category = await notesServices.createCategory(input);
  res.status(201).json({ data: category });
}

export async function updateCategory(req, res) {
  const categoryId = parseCategoryIdParam(req.params.id);
  const input = parseBody(updateNoteCategoryInput, req.body ?? {});
  const category = await notesServices.updateCategory(categoryId, input);
  res.json({ data: category });
}

export async function removeCategory(req, res) {
  const categoryId = parseCategoryIdParam(req.params.id);
  await notesServices.deleteCategory(categoryId);
  res.status(204).send();
}
