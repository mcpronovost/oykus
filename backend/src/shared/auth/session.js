import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../db/index.js";
import { config } from "../config/index.js";

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiryDate(from = new Date()) {
  return new Date(from.getTime() + config.session.ttlMs);
}

export async function createSession({ userId, token, userAgent, ip }) {
  return prisma.userSession.create({
    data: {
      token: hashSessionToken(token),
      userId,
      expiresAt: sessionExpiryDate(),
      userAgent: userAgent ?? null,
      ip: ip ?? null,
    },
  });
}

export async function findValidSession(token) {
  if (!token) {
    return null;
  }

  const session = await prisma.userSession.findUnique({
    where: { token: hashSessionToken(token) },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.userSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session;
}

export async function touchSession(sessionId) {
  return prisma.userSession.update({
    where: { id: sessionId },
    data: { expiresAt: sessionExpiryDate() },
  });
}

export async function deleteSessionByToken(token) {
  if (!token) {
    return;
  }

  await prisma.userSession.deleteMany({
    where: { token: hashSessionToken(token) },
  });
}

export async function deleteSessionsForUser(userId) {
  await prisma.userSession.deleteMany({
    where: { userId },
  });
}
