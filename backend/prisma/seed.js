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

async function seedUsers() {
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

async function seedEncyclopediaTopics() {
  const topics = [
    {
      slug: "characters",
      icon: "users",
      color: "accent",
      // categories: ["individuals", "species", "creatures"],
    },
    {
      slug: "factions",
      icon: "crown",
      color: "info",
      // categories: ["organizations", "cultures", "kingdoms"],
    },
    {
      slug: "locations",
      icon: "map",
      color: "special",
      categories: ["continents", "regions", "cities"],
    },
    {
      slug: "nature",
      icon: "leaf",
      color: "success",
      categories: ["flora", "fauna"],
    },
    {
      slug: "items",
      icon: "shield",
      color: "info",
      categories: ["weapons", "artifacts", "equipment", "resources"],
    },
    {
      slug: "events",
      icon: "flare",
      color: "special",
      categories: ["historical", "political", "military", "natural"],
    },
    {
      slug: "lore",
      icon: "news",
      color: "accent",
      categories: ["myths", "legends", "beliefs", "knowledge"],
    },
  ];

  await prisma.$transaction(async (tx) => {
    for (const [index, topic] of topics.entries()) {
      const { categories, slug, icon, color } = topic;
      const position = index;

      const createdTopic = await tx.encyclopediaTopic.upsert({
        where: { slug },
        create: { slug, position, icon, color },
        update: { position, icon, color },
      });

      if (!categories?.length) {
        continue;
      }

      await tx.encyclopediaTopicCategory.createMany({
        data: categories.map((categorySlug) => ({
          slug: categorySlug,
          topicId: createdTopic.id,
        })),
        skipDuplicates: true,
      });
    }
  });

  console.log(`Seeded ${topics.length} encyclopedia topics`);
}

async function seedNoteCategories() {
  const categories = await prisma.noteCategory.createMany({
    data: [
      { label: "idea" },
      { label: "inspiration" },
      { label: "quote" },
      { label: "question" },
      { label: "thought" },
      { label: "other" },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${categories.count} note categories`);
}

async function main() {
  try { await seedUsers(); } catch (e) { console.error("Seed users failed:", e); }
  try { await seedNoteCategories(); } catch (e) { console.error("Seed note categories failed:", e); }
  try { await seedEncyclopediaTopics(); } catch (e) { console.error("Seed encyclopedia topics failed:", e); }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
