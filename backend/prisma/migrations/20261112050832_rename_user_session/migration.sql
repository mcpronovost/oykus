/*
  Warnings:

  - You are about to drop the `core_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "core_sessions" DROP CONSTRAINT "core_sessions_userId_fkey";

-- AlterTable
ALTER TABLE "core_users" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'fr',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- DropTable
DROP TABLE "core_sessions";

-- CreateTable
CREATE TABLE "core_user_sessions" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "user_agent" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "core_user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_user_sessions_token_key" ON "core_user_sessions"("token");

-- CreateIndex
CREATE INDEX "core_user_sessions_userId_idx" ON "core_user_sessions"("userId");

-- CreateIndex
CREATE INDEX "core_user_sessions_expires_at_idx" ON "core_user_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "core_user_sessions" ADD CONSTRAINT "core_user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
