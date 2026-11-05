import { prisma } from "../../shared/db/index.js";
import { NotFoundError } from "../../shared/errors/index.js";

const USER_PUBLIC_SELECT = {
  id: true,
  username: true,
  email: true,
  name: true,
  avatar: true,
  cover: true,
  createdAt: true,
  updatedAt: true,
};

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_PUBLIC_SELECT,
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
