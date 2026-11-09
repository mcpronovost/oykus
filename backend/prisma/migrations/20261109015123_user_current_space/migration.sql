-- AlterTable
ALTER TABLE "core_users" ADD COLUMN     "currentSpaceId" UUID;

-- CreateIndex
CREATE INDEX "core_users_currentSpaceId_idx" ON "core_users"("currentSpaceId");

-- AddForeignKey
ALTER TABLE "core_users" ADD CONSTRAINT "core_users_currentSpaceId_fkey" FOREIGN KEY ("currentSpaceId") REFERENCES "core_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
