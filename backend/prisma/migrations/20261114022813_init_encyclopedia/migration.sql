-- CreateTable
CREATE TABLE "features_encyclopedia_topics" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "features_encyclopedia_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_encyclopedia_topics_categories" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "features_encyclopedia_topics_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_encyclopedia_entries" (
    "id" UUID NOT NULL,
    "spaceId" UUID NOT NULL,
    "topicId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "features_encyclopedia_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_encyclopedia_entries_sections" (
    "id" UUID NOT NULL,
    "entryId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "position" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "features_encyclopedia_entries_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "features_encyclopedia_topics_slug_key" ON "features_encyclopedia_topics"("slug");

-- CreateIndex
CREATE INDEX "features_encyclopedia_topics_categories_topicId_idx" ON "features_encyclopedia_topics_categories"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "features_encyclopedia_topics_categories_topicId_slug_key" ON "features_encyclopedia_topics_categories"("topicId", "slug");

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_spaceId_topicId_idx" ON "features_encyclopedia_entries"("spaceId", "topicId");

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_spaceId_categoryId_idx" ON "features_encyclopedia_entries"("spaceId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "features_encyclopedia_entries_spaceId_slug_key" ON "features_encyclopedia_entries"("spaceId", "slug");

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_sections_entryId_idx" ON "features_encyclopedia_entries_sections"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "features_encyclopedia_entries_sections_entryId_position_key" ON "features_encyclopedia_entries_sections"("entryId", "position");

-- AddForeignKey
ALTER TABLE "features_encyclopedia_topics_categories" ADD CONSTRAINT "features_encyclopedia_topics_categories_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "features_encyclopedia_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries" ADD CONSTRAINT "features_encyclopedia_entries_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "core_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries" ADD CONSTRAINT "features_encyclopedia_entries_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "features_encyclopedia_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries" ADD CONSTRAINT "features_encyclopedia_entries_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "features_encyclopedia_topics_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries_sections" ADD CONSTRAINT "features_encyclopedia_entries_sections_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "features_encyclopedia_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
