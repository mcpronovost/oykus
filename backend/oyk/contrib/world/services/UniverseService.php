<?php

class UniverseService {
  public function __construct(private PDO $pdo) {
  }

  public function getContext(?string $slug, int $userId): array {
    // Default universe if no context
    if (!$slug) {
      $qry = $this->pdo->prepare("
          SELECT id, is_default
          FROM world_universes
          WHERE is_active = 1 AND is_default = 1
          LIMIT 1
        ");
      $qry->execute();
    }
    else {
      $qry = $this->pdo->prepare("
          SELECT wu.id, wu.is_default
          FROM world_universes wu
          LEFT JOIN world_roles wr ON wr.universe_id = wu.id AND wr.user_id = COALESCE(?, -1)
          WHERE wu.is_active = 1 AND wu.slug = ? AND wu.visibility >= CASE
              WHEN ? IS NULL THEN 6
              ELSE COALESCE(wr.role, 5)
          END
          LIMIT 1
        ");
      $qry->execute([$userId, $slug, $userId]);
    }
    $universe = $qry->fetch();

    if (!$universe) {
      Response::notFound("Universe not found");
    }

    return [
      "id" => (int) $universe["id"],
      "isDefault" => (bool) $universe["is_default"]
    ];
  }

  public function getEditableUniverseId($universeSlug, $userId) {
    try {
      $qry = $this->pdo->prepare("
        SELECT id, owner
        FROM world_universes
        WHERE slug = ? AND is_active = 1
        LIMIT 1
      ");

      $qry->execute([$universeSlug]);
      $universe = $qry->fetch();
    }
    catch (Exception $e) {
      return NULL;
    }

    if (!$universe) {
      return NULL;
    }

    if ((int) $universe["owner"] !== (int) $userId) {
      return NULL;
    }

    return $universe["id"] ?: NULL;
  }

  public function getUniverses(?int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wu.id,
               wu.name,
               wu.slug,
               wu.abbr,
               wu.logo,
               wu.cover,
               wu.visibility,
               wt.c_primary,
               wt.c_primary_fg,
               CASE
                WHEN ? <= 0 THEN 6
                ELSE COALESCE(wr.role, 5)
              END AS role
        FROM world_universes wu
        LEFT JOIN world_themes wt ON wt.universe_id = wu.id AND wt.is_active = 1
        LEFT JOIN world_roles wr ON wr.universe_id = wu.id AND wr.user_id = COALESCE(?, -1)
        WHERE wu.is_active = 1 AND wu.visibility >= CASE
            WHEN ? <= 0 THEN 6
            ELSE COALESCE(wr.role, 5)
        END
        ORDER BY wu.is_default DESC,
                (wu.owner_id = ?) DESC,
                 wu.name ASC;
      ");

      $qry->execute([$userId, $userId, $userId, $userId]);
      $universes = $qry->fetchAll();
    }
    catch (Exception) {
      throw new QueryException("Universes retrieval failed");
    }

    foreach ($universes as &$u) {
      $u["staff"] = $this->getUniverseStaff($u["id"]);
    }
    unset($u);

    return $universes;
  }

  public function getUniverse(?string $universeSlug, int $userId): array {
    $universeSlug ?? "oykus";

    try {
      $qry = $this->pdo->prepare("
        SELECT wu.id,
                wu.name,
                wu.slug,
                wu.abbr,
                wu.logo,
                wu.cover,
                wu.is_default,
                wu.visibility,
                CASE
                  WHEN ? IS NULL THEN 6
                  ELSE COALESCE(wr.role, 5)
                END AS role,
                wu.created_at,
                wu.updated_at
        FROM world_universes wu
        LEFT JOIN world_roles wr ON wr.universe_id = wu.id AND wr.user_id = COALESCE(?, -1)
        WHERE wu.slug = ? AND wu.is_active = 1 AND wu.visibility >= CASE
          WHEN ? IS NULL THEN 6
          ELSE COALESCE(wr.role, 5)
        END
        LIMIT 1;
      ");

      $qry->execute([$userId, $userId, $universeSlug, $userId]);
      $universe = $qry->fetch();

      if (!$universe) {
        throw new NotFoundException("Universe not found");
      }
    }
    catch (Exception) {
      throw new QueryException("Universe retrieval failed");
    }

    $universe["staff"] = $this->getUniverseStaff((int) $universe["id"]);

    return $universe ?: NULL;
  }

  public function getUniverseStaff(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wr.role, au.name, au.abbr, au.slug, au.avatar
        FROM world_roles wr
        JOIN auth_users au ON au.id = wr.user_id
        WHERE wr.universe_id = ?
        ORDER BY wr.role DESC
      ");
      $qry->execute([$universeId]);
      $rows = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Staff retrieval failed");
    }

    $staff = [
      "owner" => NULL,
      "admins" => [],
      "modos" => [],
    ];

    foreach ($rows as $row) {
      switch ($row["role"]) {
        case 1:
          $staff["owner"] = $row;
          break;
        case 2:
          $staff["admins"][] = $row;
          break;
        case 3:
          $staff["modos"][] = $row;
          break;
      }
    }

    if (empty($staff["owner"])) {
      try {
        $qry = $this->pdo->prepare("
          SELECT wu.owner_id, au.name, au.abbr, au.slug, au.avatar
          FROM world_universes wu
          JOIN auth_users au ON au.id = wu.owner_id
          WHERE wu.id = ? 
          LIMIT 1
        ");
        $qry->execute([$universeId]);
        $row = $qry->fetch();

        $qry = $this->pdo->prepare("
          INSERT INTO world_roles (universe_id, user_id, role)
          VALUES (?, ?, 1)
          ON DUPLICATE KEY UPDATE role = 1
        ");
        $qry->execute([$universeId, $row["owner_id"]]);

        $staff["owner"] = $row;
      }
      catch (Exception $e) {
        throw new QueryException("Staff retrieval failed");
      }
    }

    if (!$staff) {
      $staff = [];
    }

    return $staff;
  }

  public function getUserRole(int $universeId, int $userId): int {
    try {
      $qry = $this->pdo->prepare("
        SELECT CASE
          WHEN ? IS NULL THEN 6
          ELSE COALESCE(wr.role, 5)
        END AS role
        FROM world_universes wu
        LEFT JOIN world_roles wr ON wr.universe = wu.id AND wr.user = ?
        WHERE wu.id = ?
        LIMIT 1
      ");
      $qry->execute([$userId, $userId, $universeId]);
      $universe = $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Role retrieval failed");
    }

    if (!$universe) {
      Response::notFound("Universe not found");
    }

    return (int) $universe["role"] ?: 6;
  }
}
