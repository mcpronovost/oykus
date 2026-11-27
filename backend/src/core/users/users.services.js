import { prisma } from "../../shared/db/index.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import { deleteUploadIfOwned, saveUserProfileImage } from "../../shared/uploads.js";
import { deleteSpaceRecords } from "../spaces/spaces.services.js";
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

export async function updateProfile(userId, details, images) {
  const uploads = {};
  let result;
  try {
    for (const [field, buffer] of Object.entries(images)) {
      uploads[field] = buffer === null ? null : await saveUserProfileImage(userId, buffer);
    }

    result = await prisma.$transaction(async (tx) => {
      const where = { id: userId };
      const fields = Object.keys(uploads);
      const select = Object.fromEntries(fields.map((field) => [field, true]));
      const previous = fields.length > 0 ? await tx.user.findUnique({ where, select }) : {};
      if (!previous) throw new NotFoundError("User not found");

      const { count } = await tx.user.updateMany({
        where: { ...where, ...previous },
        data: { ...details, ...uploads },
      });
      if (count === 0) {
        if (fields.length === 0) throw new NotFoundError("User not found");
        throw new ConflictError("Profile images changed during the update");
      }

      const user = await tx.user.findUniqueOrThrow({ where, select: USER_OUTPUT_SELECT });
      return { user, previous };
    });
  } catch (error) {
    await Promise.allSettled(Object.values(uploads).map(deleteUploadIfOwned));
    throw error;
  }

  const uploadPrefix = `/uploads/users/${userId}/`;
  await Promise.allSettled(
    Object.values(result.previous)
      .filter((url) => url?.startsWith(uploadPrefix))
      .map(deleteUploadIfOwned),
  );
  return result.user;
}

export async function deleteAccount(userId, { confirmationName }) {
  const { avatar, cover, spaceCovers } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { name: true, ownedSpaces: { select: { id: true } } },
    });
    if (!user) throw new NotFoundError("User not found");
    if (confirmationName !== user.name.trim()) {
      throw new BadRequestError("Type your profile name exactly to confirm.");
    }

    const spaceCovers = [];
    for (const { id } of user.ownedSpaces) {
      const space = await deleteSpaceRecords(tx, id);
      spaceCovers.push(space.cover);
    }

    const deletedUser = await tx.user.delete({
      where: { id: userId, name: user.name },
      select: { avatar: true, cover: true },
    });

    return { ...deletedUser, spaceCovers };
  });

  const uploadPrefix = `/uploads/users/${userId}/`;
  const profileUploads = [avatar, cover].filter((url) => url?.startsWith(uploadPrefix));
  await Promise.allSettled([...profileUploads, ...spaceCovers].map(deleteUploadIfOwned));
}

export async function setCurrentSpace(userId, { spaceId }) {
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

  const user = await prisma.user.update({
    where: { id: userId },
    data: { currentSpaceId: spaceId },
    select: USER_OUTPUT_SELECT,
  });

  return user;
}
