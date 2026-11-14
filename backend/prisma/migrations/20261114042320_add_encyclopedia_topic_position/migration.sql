-- AlterTable
ALTER TABLE "features_encyclopedia_topics" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "features_encyclopedia_topics_position_idx" ON "features_encyclopedia_topics"("position");
