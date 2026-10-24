import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/db/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
const app = express();

app.get("/api/health", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.use((error, req, res, next) => {
  void next;
  res.status(500).json({ ok: false });
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, "0.0.0.0");
