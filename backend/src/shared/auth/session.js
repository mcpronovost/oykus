import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../db/index.js";
import { config } from "../config/index.js";

const SESSION_SELECT = { id: true, userId: true, expiresAt: true, updatedAt: true };

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

async function findValidSession(tokenHash) {
  const session = await prisma.userSession.findUnique({
    where: { token: tokenHash },
    select: SESSION_SELECT,
  });

  if (!session) {
    return null;
  }

  const now = new Date();
  if (session.expiresAt <= now) {
    await prisma.userSession.deleteMany({
      where: { id: session.id, expiresAt: { lte: now } },
    });
    return null;
  }

  return session;
}

export async function authenticateSession(token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);
  const session = await findValidSession(tokenHash);
  if (!session) {
    return null;
  }

  const now = new Date();
  const refreshCutoff = new Date(now.getTime() - config.session.refreshIntervalMs);
  if (session.updatedAt > refreshCutoff && session.expiresAt > now) {
    return { session, refreshed: false };
  }

  const [refreshedSession] = await prisma.userSession.updateManyAndReturn({
    where: { id: session.id, updatedAt: { lte: refreshCutoff }, expiresAt: { gt: now } },
    data: { updatedAt: now, expiresAt: sessionExpiryDate(now) },
    select: SESSION_SELECT,
  });
  if (refreshedSession) {
    return { session: refreshedSession, refreshed: true };
  }

  const currentSession = await findValidSession(tokenHash);
  return currentSession ? { session: currentSession, refreshed: false } : null;
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
