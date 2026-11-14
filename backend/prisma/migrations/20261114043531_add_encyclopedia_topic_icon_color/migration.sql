-- AlterTable
ALTER TABLE "features_encyclopedia_topics"
ADD COLUMN "color" TEXT NOT NULL DEFAULT '',
ADD COLUMN "icon" TEXT NOT NULL DEFAULT '';

ALTER TABLE "features_encyclopedia_topics"
ALTER COLUMN "color" DROP DEFAULT,
ALTER COLUMN "icon" DROP DEFAULT;
