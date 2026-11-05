import { prisma } from "../../shared/db/index.js";
import { NotFoundError } from "../../shared/errors/index.js";
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
