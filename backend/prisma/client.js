import { PrismaClient, TaskHistoryChangeType } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
export { TaskHistoryChangeType };