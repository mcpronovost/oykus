/*
  Warnings:

  - A unique constraint covering the columns `[spaceId,topicId,slug]` on the table `features_encyclopedia_entries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "features_encyclopedia_entries" DROP CONSTRAINT "features_encyclopedia_entries_topicId_fkey";

-- DropIndex
DROP INDEX "features_encyclopedia_entries_spaceId_slug_key";

-- DropIndex
DROP INDEX "features_encyclopedia_entries_sections_entryId_position_key";

-- AlterTable
ALTER TABLE "features_encyclopedia_entries" ADD COLUMN     "createdById" UUID,
ADD COLUMN     "updatedById" UUID;

-- AlterTable
ALTER TABLE "features_encyclopedia_entries_sections" ADD COLUMN     "createdById" UUID,
ADD COLUMN     "updatedById" UUID,
ALTER COLUMN "position" SET DEFAULT 0,
ALTER COLUMN "position" DROP DEFAULT;
DROP SEQUENCE "features_encyclopedia_entries_sections_position_seq";

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_createdById_idx" ON "features_encyclopedia_entries"("createdById");

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_updatedById_idx" ON "features_encyclopedia_entries"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "features_encyclopedia_entries_spaceId_topicId_slug_key" ON "features_encyclopedia_entries"("spaceId", "topicId", "slug");

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_sections_createdById_idx" ON "features_encyclopedia_entries_sections"("createdById");

-- CreateIndex
CREATE INDEX "features_encyclopedia_entries_sections_updatedById_idx" ON "features_encyclopedia_entries_sections"("updatedById");

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries" ADD CONSTRAINT "features_encyclopedia_entries_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "features_encyclopedia_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries" ADD CONSTRAINT "features_encyclopedia_entries_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries" ADD CONSTRAINT "features_encyclopedia_entries_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries_sections" ADD CONSTRAINT "features_encyclopedia_entries_sections_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_encyclopedia_entries_sections" ADD CONSTRAINT "features_encyclopedia_entries_sections_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
