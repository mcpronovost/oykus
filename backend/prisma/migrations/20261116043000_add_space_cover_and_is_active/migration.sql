-- AlterTable
ALTER TABLE "core_spaces"
ADD COLUMN "cover" TEXT,
ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
