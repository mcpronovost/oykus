-- CreateTable
CREATE TABLE "core_spaces_logs" (
    "id" UUID NOT NULL,
    "spaceId" UUID NOT NULL,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_spaces_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "core_spaces_logs_spaceId_idx" ON "core_spaces_logs"("spaceId");

-- CreateIndex
CREATE INDEX "core_spaces_logs_userId_idx" ON "core_spaces_logs"("userId");

-- AddForeignKey
ALTER TABLE "core_spaces_logs" ADD CONSTRAINT "core_spaces_logs_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "core_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_spaces_logs" ADD CONSTRAINT "core_spaces_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
