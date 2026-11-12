-- CreateTable
CREATE TABLE "core_user_streaks" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_streak_date" DATE,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "core_user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "core_user_streaks_userId_idx" ON "core_user_streaks"("userId");

-- AddForeignKey
ALTER TABLE "core_user_streaks" ADD CONSTRAINT "core_user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
