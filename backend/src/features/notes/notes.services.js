import { prisma } from "../../shared/db/index.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/index.js";
import {
  NOTE_CATEGORY_OUTPUT_SELECT,
  NOTE_OUTPUT_SELECT,
  toNoteCategoryOutput,
  toNoteOutput,
} from "./notes.outputs.js";

async function assertSpaceAccess(spaceId, userId) {
  const space = await prisma.space.findFirst({
    where: {
      id: spaceId,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    select: { id: true },
  });

  if (!space) {
    throw new ForbiddenError("No access to this space");
  }
}

async function getAccessibleNote(noteId, userId) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: NOTE_OUTPUT_SELECT,
  });

  if (!note) {
    throw new NotFoundError("Note not found");
  }

  await assertSpaceAccess(note.spaceId, userId);
  return note;
}

async function assertCategoryExists(categoryId) {
  if (categoryId === undefined || categoryId === null) {
    return;
  }

  const category = await prisma.noteCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new NotFoundError("Note category not found");
  }
}

export async function listNotes(userId, { spaceId }) {
  await assertSpaceAccess(spaceId, userId);

  const notes = await prisma.note.findMany({
    where: { spaceId },
    select: NOTE_OUTPUT_SELECT,
    orderBy: { updatedAt: "desc" },
  });

  return notes.map(toNoteOutput);
}

export async function getNote(userId, noteId) {
  const note = await getAccessibleNote(noteId, userId);
  return toNoteOutput(note);
}

export async function createNote(userId, { content, spaceId, categoryId }) {
  await assertSpaceAccess(spaceId, userId);
  await assertCategoryExists(categoryId);

  const note = await prisma.note.create({
    data: {
      content,
      spaceId,
      userId,
      categoryId: categoryId ?? null,
    },
    select: NOTE_OUTPUT_SELECT,
  });

  return toNoteOutput(note);
}

export async function updateNote(userId, noteId, { content, categoryId }) {
  const existing = await getAccessibleNote(noteId, userId);

  if (existing.userId !== userId) {
    throw new ForbiddenError("Only the author can update this note");
  }

  if (content === undefined && categoryId === undefined) {
    return toNoteOutput(existing);
  }

  await assertCategoryExists(categoryId);

  const note = await prisma.note.update({
    where: { id: noteId },
    data: {
      ...(content !== undefined ? { content } : {}),
      ...(categoryId !== undefined ? { categoryId } : {}),
    },
    select: NOTE_OUTPUT_SELECT,
  });

  return toNoteOutput(note);
}

export async function deleteNote(userId, noteId) {
  const existing = await getAccessibleNote(noteId, userId);

  if (existing.userId !== userId) {
    throw new ForbiddenError("Only the author can delete this note");
  }

  await prisma.note.delete({ where: { id: noteId } });
}

export async function listCategories() {
  const categories = await prisma.noteCategory.findMany({
    select: NOTE_CATEGORY_OUTPUT_SELECT,
    orderBy: { label: "asc" },
  });

  return categories.map(toNoteCategoryOutput);
}

export async function createCategory({ label }) {
  try {
    const category = await prisma.noteCategory.create({
      data: { label },
      select: NOTE_CATEGORY_OUTPUT_SELECT,
    });
    return toNoteCategoryOutput(category);
  } catch (error) {
    if (error?.code === "P2002") {
      throw new ConflictError("Category label already in use");
    }
    throw error;
  }
}

export async function updateCategory(categoryId, { label }) {
  const existing = await prisma.noteCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Note category not found");
  }

  try {
    const category = await prisma.noteCategory.update({
      where: { id: categoryId },
      data: { label },
      select: NOTE_CATEGORY_OUTPUT_SELECT,
    });
    return toNoteCategoryOutput(category);
  } catch (error) {
    if (error?.code === "P2002") {
      throw new ConflictError("Category label already in use");
    }
    throw error;
  }
}

export async function deleteCategory(categoryId) {
  const existing = await prisma.noteCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Note category not found");
  }

  await prisma.noteCategory.delete({ where: { id: categoryId } });
}
