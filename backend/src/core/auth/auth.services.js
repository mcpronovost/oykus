import { prisma } from "../../shared/db/index.js";
import { ConflictError, UnauthorizedError } from "../../shared/errors/index.js";
import { hashPassword, verifyPassword } from "../../shared/auth/password.js";
import {
  createSession,
  createSessionToken,
  deleteSessionByToken,
  deleteSessionsForUser,
} from "../../shared/auth/session.js";
import { USER_OUTPUT_SELECT, toUserOutput } from "../users/users.outputs.js";

async function issueSession(user, { userAgent, ip }) {
  const token = createSessionToken();
  await createSession({
    userId: user.id,
    token,
    userAgent,
    ip,
  });
  return { token, user: toUserOutput(user) };
}

export async function register({ username, email, password, name }, meta) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: { email: true, username: true },
  });

  if (existing) {
    if (existing.email === email) {
      throw new ConflictError("Email already in use");
    }
    throw new ConflictError("Username already in use");
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: await hashPassword(password),
      name,
    },
    select: USER_OUTPUT_SELECT,
  });

  return issueSession(user, meta);
}

export async function login({ username, password }, meta) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...USER_OUTPUT_SELECT,
      password: true,
    },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new UnauthorizedError("Invalid username or password");
  }

  const { password: _password, ...publicUser } = user;
  return issueSession(publicUser, meta);
}

export async function logout(token) {
  await deleteSessionByToken(token);
}

export async function logoutEverywhere(userId) {
  await deleteSessionsForUser(userId);
}
