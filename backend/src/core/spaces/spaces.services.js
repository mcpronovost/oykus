import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import { prisma } from "../../shared/db/index.js";
import { deleteUploadIfOwned, saveSpaceCover } from "../../shared/uploads.js";
import { SPACE_OUTPUT_SELECT, toSpaceOutput } from "./spaces.outputs.js";

async function getOwnedSpace(userId, spaceId, select = SPACE_OUTPUT_SELECT) {
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    select: { ...select, ownerId: true },
  });

  if (!space) {
    throw new NotFoundError("Space not found");
  }

  if (space.ownerId !== userId) {
    throw new ForbiddenError("Only the owner can manage this space");
  }

  return space;
}

export async function listSpaces(userId) {
  const spaces = await prisma.space.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          isActive: true,
          members: { some: { userId } },
        },
      ],
    },
    select: SPACE_OUTPUT_SELECT,
    orderBy: { updatedAt: "desc" },
  });

  return spaces.map(toSpaceOutput);
}

export async function createSpace(userId, { name, description }) {
  const space = await prisma.$transaction(async (tx) => {
    const created = await tx.space.create({
      data: {
        name,
        description: description || null,
        ownerId: userId,
      },
      select: SPACE_OUTPUT_SELECT,
    });

    await tx.user.update({
      where: { id: userId },
      data: { currentSpaceId: created.id },
    });

    return created;
  });

  return toSpaceOutput(space);
}

export async function updateSpace(userId, spaceId, input) {
  await getOwnedSpace(userId, spaceId, { id: true });

  const data = {};
  if (input.name !== undefined && input.name !== null) {
    data.name = input.name;
  }
  if (input.description !== undefined && input.description !== null) {
    data.description = input.description.length > 0 ? input.description : null;
  }

  const space = await prisma.space.update({
    where: { id: spaceId },
    data,
    select: SPACE_OUTPUT_SELECT,
  });

  return toSpaceOutput(space);
}

export async function setSpaceActive(userId, spaceId, isActive) {
  await getOwnedSpace(userId, spaceId, { id: true });

  const space = await prisma.space.update({
    where: { id: spaceId },
    data: { isActive },
    select: SPACE_OUTPUT_SELECT,
  });

  return toSpaceOutput(space);
}

export async function updateSpaceCover(userId, spaceId, webpBuffer) {
  const space = await getOwnedSpace(userId, spaceId, {
    id: true,
    cover: true,
  });

  const cover = await saveSpaceCover(webpBuffer);
  const previousCover = space.cover;

  const updated = await prisma.space.update({
    where: { id: spaceId },
    data: { cover },
    select: SPACE_OUTPUT_SELECT,
  });

  if (previousCover && previousCover !== cover) {
    await deleteUploadIfOwned(previousCover);
  }

  return toSpaceOutput(updated);
}

export async function deleteSpace(userId, spaceId) {
  const space = await getOwnedSpace(userId, spaceId, {
    id: true,
    cover: true,
  });

  await prisma.$transaction(async (tx) => {
    await tx.spaceMember.deleteMany({ where: { spaceId } });
    await tx.spaceRole.deleteMany({ where: { spaceId } });
    await tx.space.delete({ where: { id: spaceId } });
  });

  if (space.cover) {
    await deleteUploadIfOwned(space.cover);
  }
}

export async function assertSpaceAccess(spaceId, userId) {
  const space = await prisma.space.findFirst({
    where: {
      id: spaceId,
      OR: [
        { ownerId: userId },
        {
          isActive: true,
          members: { some: { userId } },
        },
      ],
    },
    select: { id: true },
  });

  if (!space) {
    throw new ForbiddenError("No access to this space");
  }
}

export async function getSpaceStats(userId, spaceId) {
  await assertSpaceAccess(spaceId, userId);

  const [notes, topics, entryCounts] = await Promise.all([
    prisma.note.count({ where: { spaceId } }),
    prisma.encyclopediaTopic.findMany({
      select: { id: true, slug: true },
      orderBy: { position: "asc" },
    }),
    prisma.encyclopediaEntry.groupBy({
      by: ["topicId"],
      where: { spaceId },
      _count: { _all: true },
    }),
  ]);

  const countByTopicId = new Map(
    entryCounts.map((row) => [row.topicId, row._count._all]),
  );

  return {
    notes,
    encyclopedia: topics.map((topic) => ({
      slug: topic.slug,
      count: countByTopicId.get(topic.id) ?? 0,
    })),
  };
}
