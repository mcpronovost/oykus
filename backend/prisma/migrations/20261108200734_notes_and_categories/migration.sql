-- CreateTable
CREATE TABLE "features_notes" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" INTEGER,
    "spaceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "features_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_notes_categories" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "features_notes_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "features_notes_spaceId_idx" ON "features_notes"("spaceId");

-- CreateIndex
CREATE INDEX "features_notes_userId_idx" ON "features_notes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "features_notes_categories_label_key" ON "features_notes_categories"("label");

-- AddForeignKey
ALTER TABLE "features_notes" ADD CONSTRAINT "features_notes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "features_notes_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_notes" ADD CONSTRAINT "features_notes_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "core_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_notes" ADD CONSTRAINT "features_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
