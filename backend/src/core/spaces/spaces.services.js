import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import { prisma } from "../../shared/db/index.js";
import { SPACE_OUTPUT_SELECT, toSpaceOutput } from "./spaces.outputs.js";

export async function listSpaces(userId) {
  const spaces = await prisma.space.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
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

export async function deleteSpace(userId, spaceId) {
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    select: { id: true, ownerId: true },
  });

  if (!space) {
    throw new NotFoundError("Space not found");
  }

  if (space.ownerId !== userId) {
    throw new ForbiddenError("Only the owner can delete this space");
  }

  await prisma.$transaction(async (tx) => {
    await tx.spaceMember.deleteMany({ where: { spaceId } });
    await tx.spaceRole.deleteMany({ where: { spaceId } });
    await tx.space.delete({ where: { id: spaceId } });
  });
}
