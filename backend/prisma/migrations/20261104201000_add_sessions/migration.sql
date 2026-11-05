-- CreateTable
CREATE TABLE "core_sessions" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "user_agent" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "core_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_sessions_token_key" ON "core_sessions"("token");

-- CreateIndex
CREATE INDEX "core_sessions_userId_idx" ON "core_sessions"("userId");

-- CreateIndex
CREATE INDEX "core_sessions_expires_at_idx" ON "core_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "core_sessions" ADD CONSTRAINT "core_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
