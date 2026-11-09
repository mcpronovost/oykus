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
