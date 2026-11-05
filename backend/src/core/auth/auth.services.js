import { prisma } from "../../shared/db/index.js";
import { ConflictError, UnauthorizedError } from "../../shared/errors/index.js";
import { hashPassword, verifyPassword } from "../../shared/auth/password.js";
import {
  createSession,
  createSessionToken,
  deleteSessionByToken,
  deleteSessionsForUser,
} from "../../shared/auth/session.js";

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

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    cover: user.cover,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function issueSession(user, { userAgent, ip }) {
  const token = createSessionToken();
  await createSession({
    userId: user.id,
    token,
    userAgent,
    ip,
  });
  return { token, user: toPublicUser(user) };
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
    select: USER_PUBLIC_SELECT,
  });

  return issueSession(user, meta);
}

export async function login({ email, password }, meta) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return issueSession(user, meta);
}

export async function logout(token) {
  await deleteSessionByToken(token);
}

export async function logoutEverywhere(userId) {
  await deleteSessionsForUser(userId);
}
