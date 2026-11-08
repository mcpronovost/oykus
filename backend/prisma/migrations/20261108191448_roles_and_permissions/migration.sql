-- CreateTable
CREATE TABLE "core_spaces_members" (
    "id" UUID NOT NULL,
    "spaceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "core_spaces_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_spaces_roles" (
    "id" UUID NOT NULL,
    "spaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "core_spaces_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_spaces_roles_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permission" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "core_spaces_roles_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "core_spaces_members_userId_idx" ON "core_spaces_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "core_spaces_members_spaceId_userId_key" ON "core_spaces_members"("spaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "core_spaces_roles_id_spaceId_key" ON "core_spaces_roles"("id", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "core_spaces_roles_spaceId_name_key" ON "core_spaces_roles"("spaceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "core_spaces_roles_permissions_roleId_permission_key" ON "core_spaces_roles_permissions"("roleId", "permission");

-- AddForeignKey
ALTER TABLE "core_spaces_members" ADD CONSTRAINT "core_spaces_members_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "core_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_spaces_members" ADD CONSTRAINT "core_spaces_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_spaces_members" ADD CONSTRAINT "core_spaces_members_roleId_spaceId_fkey" FOREIGN KEY ("roleId", "spaceId") REFERENCES "core_spaces_roles"("id", "spaceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_spaces_roles" ADD CONSTRAINT "core_spaces_roles_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "core_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_spaces_roles_permissions" ADD CONSTRAINT "core_spaces_roles_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "core_spaces_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
