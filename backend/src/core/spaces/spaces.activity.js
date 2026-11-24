import { prisma } from "../../shared/db/index.js";
import { assertSpaceAccess } from "./spaces.access.js";

const newestFirst = [{ createdAt: "desc" }, { id: "desc" }];

export async function listSpaceLogs(spaceId, userId, limit) {
  await assertSpaceAccess(spaceId, userId);

  const logs = await prisma.spaceLog.findMany({
    where: { spaceId },
    select: {
      id: true,
      action: true,
      details: true,
      createdAt: true,
      user: { select: { name: true } },
    },
    orderBy: newestFirst,
    take: limit,
  });

  return logs.map(({ user, ...log }) => ({ ...log, userName: user?.name ?? null }));
}

export async function recordSpaceActivity(tx, { spaceId, userId, limitLogs, action, details }) {
  if (limitLogs <= 0) {
    await tx.spaceLog.deleteMany({ where: { spaceId } });
    return;
  }

  // Leave room for the new row without exceeding the limit.
  const newestToRemove = await tx.spaceLog.findFirst({
    where: { spaceId },
    orderBy: newestFirst,
    skip: limitLogs - 1,
    select: { id: true, createdAt: true },
  });

  if (newestToRemove) {
    await tx.spaceLog.deleteMany({
      where: {
        spaceId,
        OR: [
          { createdAt: { lt: newestToRemove.createdAt } },
          { createdAt: newestToRemove.createdAt, id: { lte: newestToRemove.id } },
        ],
      },
    });
  }

  await tx.spaceLog.create({
    data: { spaceId, userId, action, details, createdAt: new Date() },
    select: { id: true },
  });
}

export async function withSpaceActivity(spaceId, userId, action, mutate, getDetails) {
  return prisma.$transaction(async (tx) => {
    // Serialize writes to each space so concurrent requests share one retention limit.
    await tx.$queryRaw`SELECT "id" FROM "core_spaces" WHERE "id" = ${spaceId}::uuid FOR NO KEY UPDATE`;
    const { limitLogs } = await assertSpaceAccess(spaceId, userId, tx);
    const result = await mutate(tx);
    await recordSpaceActivity(tx, {
      spaceId,
      userId,
      limitLogs,
      action,
      details: getDetails?.(result),
    });
    return result;
  });
}
