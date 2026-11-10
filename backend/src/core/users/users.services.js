import { prisma } from "../../shared/db/index.js";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import { USER_OUTPUT_SELECT } from "./users.outputs.js";

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_OUTPUT_SELECT,
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

export async function setCurrentSpace(userId, { spaceId }) {
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

  const user = await prisma.user.update({
    where: { id: userId },
    data: { currentSpaceId: spaceId },
    select: USER_OUTPUT_SELECT,
  });

  return user;
}
