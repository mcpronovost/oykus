import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./db/client.ts";
import { hashPassword } from "../src/shared/auth/password.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const TEST_USER = {
  username: "mcpronovost",
  email: "mc@oykus.local",
  password: "testpass",
  name: "M-C Pronovost",
};

async function main() {
  const password = await hashPassword(TEST_USER.password);

  const user = await prisma.user.upsert({
    where: { email: TEST_USER.email },
    update: {
      username: TEST_USER.username,
      password,
      name: TEST_USER.name,
    },
    create: {
      username: TEST_USER.username,
      email: TEST_USER.email,
      password,
      name: TEST_USER.name,
    },
  });

  console.log(`Seeded test user: ${user.username} <${user.email}>`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
