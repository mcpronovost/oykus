import { prisma } from "../../shared/db/index.js";
import { ForbiddenError } from "../../shared/errors/index.js";

export async function assertSpaceAccess(spaceId, userId, db = prisma) {
  const space = await db.space.findFirst({
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
    select: { limitLogs: true },
  });

  if (!space) {
    throw new ForbiddenError("No access to this space");
  }

  return space;
}
