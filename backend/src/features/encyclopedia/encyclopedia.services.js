import { prisma } from "../../shared/db/index.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/index.js";
import {
  ENCYCLOPEDIA_CATEGORY_OUTPUT_SELECT,
  ENCYCLOPEDIA_ENTRY_DETAIL_OUTPUT_SELECT,
  ENCYCLOPEDIA_ENTRY_OUTPUT_SELECT,
  ENCYCLOPEDIA_TOPIC_OUTPUT_SELECT,
  toEncyclopediaCategoryOutput,
  toEncyclopediaEntryOutput,
  toEncyclopediaTopicOutput,
} from "./encyclopedia.outputs.js";

function slugify(value) {
  const slug = String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);

  return slug || "entry";
}

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

async function getTopicBySlug(topicSlug) {
  const topic = await prisma.encyclopediaTopic.findUnique({
    where: { slug: topicSlug },
    select: ENCYCLOPEDIA_TOPIC_OUTPUT_SELECT,
  });

  if (!topic) {
    throw new NotFoundError("Encyclopedia topic not found");
  }

  return topic;
}

async function assertCategoryForTopic(categoryId, topicId) {
  if (categoryId === undefined || categoryId === null) {
    return;
  }

  const category = await prisma.encyclopediaTopicCategory.findFirst({
    where: {
      id: categoryId,
      topicId,
    },
    select: { id: true },
  });

  if (!category) {
    throw new NotFoundError("Encyclopedia category not found");
  }
}

async function getAccessibleEntry(entryId, userId) {
  const entry = await prisma.encyclopediaEntry.findUnique({
    where: { id: entryId },
    select: ENCYCLOPEDIA_ENTRY_DETAIL_OUTPUT_SELECT,
  });

  if (!entry) {
    throw new NotFoundError("Encyclopedia entry not found");
  }

  await assertSpaceAccess(entry.spaceId, userId);
  return entry;
}

async function ensureUniqueSlug(spaceId, topicId, slug, excludeEntryId = null) {
  let candidate = slug;
  let suffix = 2;

  while (true) {
    const existing = await prisma.encyclopediaEntry.findFirst({
      where: {
        spaceId,
        topicId,
        slug: candidate,
        ...(excludeEntryId ? { id: { not: excludeEntryId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
}

export async function listTopics() {
  const topics = await prisma.encyclopediaTopic.findMany({
    select: ENCYCLOPEDIA_TOPIC_OUTPUT_SELECT,
    orderBy: { slug: "asc" },
  });

  return topics.map(toEncyclopediaTopicOutput);
}

export async function listCategories({ topic }) {
  const encyclopediaTopic = await getTopicBySlug(topic);

  const categories = await prisma.encyclopediaTopicCategory.findMany({
    where: { topicId: encyclopediaTopic.id },
    select: ENCYCLOPEDIA_CATEGORY_OUTPUT_SELECT,
    orderBy: { slug: "asc" },
  });

  return categories.map(toEncyclopediaCategoryOutput);
}

export async function listEntries(userId, { spaceId, topic, category }) {
  await assertSpaceAccess(spaceId, userId);
  const encyclopediaTopic = await getTopicBySlug(topic);

  let categoryId;
  if (category) {
    const encyclopediaCategory = await prisma.encyclopediaTopicCategory.findFirst({
      where: {
        topicId: encyclopediaTopic.id,
        slug: category,
      },
      select: { id: true },
    });

    if (!encyclopediaCategory) {
      throw new NotFoundError("Encyclopedia category not found");
    }

    categoryId = encyclopediaCategory.id;
  }

  const entries = await prisma.encyclopediaEntry.findMany({
    where: {
      spaceId,
      topicId: encyclopediaTopic.id,
      ...(categoryId !== undefined ? { categoryId } : {}),
    },
    select: ENCYCLOPEDIA_ENTRY_OUTPUT_SELECT,
    orderBy: { title: "asc" },
  });

  return entries.map(toEncyclopediaEntryOutput);
}

export async function getEntry(userId, entryId) {
  const entry = await getAccessibleEntry(entryId, userId);
  return toEncyclopediaEntryOutput(entry);
}

export async function createEntry(
  userId,
  { title, spaceId, topic, categoryId, summary, slug },
) {
  await assertSpaceAccess(spaceId, userId);
  const encyclopediaTopic = await getTopicBySlug(topic);
  await assertCategoryForTopic(categoryId, encyclopediaTopic.id);

  const baseSlug = slugify(slug || title);
  const uniqueSlug = await ensureUniqueSlug(
    spaceId,
    encyclopediaTopic.id,
    baseSlug,
  );

  try {
    const entry = await prisma.encyclopediaEntry.create({
      data: {
        title,
        slug: uniqueSlug,
        summary: summary ?? null,
        spaceId,
        topicId: encyclopediaTopic.id,
        categoryId: categoryId ?? null,
        createdById: userId,
        updatedById: userId,
      },
      select: ENCYCLOPEDIA_ENTRY_OUTPUT_SELECT,
    });

    return toEncyclopediaEntryOutput(entry);
  } catch (error) {
    if (error?.code === "P2002") {
      throw new ConflictError("Entry slug already in use for this topic");
    }
    throw error;
  }
}

export async function updateEntry(
  userId,
  entryId,
  { title, categoryId, summary, slug },
) {
  const existing = await getAccessibleEntry(entryId, userId);

  if (
    title === undefined &&
    categoryId === undefined &&
    summary === undefined &&
    slug === undefined
  ) {
    return toEncyclopediaEntryOutput(existing);
  }

  await assertCategoryForTopic(categoryId, existing.topicId);

  let nextSlug;
  if (slug !== undefined) {
    nextSlug = await ensureUniqueSlug(
      existing.spaceId,
      existing.topicId,
      slugify(slug),
      entryId,
    );
  }

  try {
    const entry = await prisma.encyclopediaEntry.update({
      where: { id: entryId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(summary !== undefined ? { summary: summary || null } : {}),
        ...(nextSlug !== undefined ? { slug: nextSlug } : {}),
        updatedById: userId,
      },
      select: ENCYCLOPEDIA_ENTRY_OUTPUT_SELECT,
    });

    return toEncyclopediaEntryOutput(entry);
  } catch (error) {
    if (error?.code === "P2002") {
      throw new ConflictError("Entry slug already in use for this topic");
    }
    throw error;
  }
}

export async function deleteEntry(userId, entryId) {
  await getAccessibleEntry(entryId, userId);
  await prisma.encyclopediaEntry.delete({ where: { id: entryId } });
}
