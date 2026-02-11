<?php

class UniverseService {
  public function __construct(private PDO $pdo) {}

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
      } else {
        $qry = $this->pdo->prepare("
          SELECT wu.id, wu.is_default
          FROM world_universes wu
          LEFT JOIN world_roles wr ON wr.universe = wu.id AND wr.user = COALESCE(?, -1)
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
        "id" => (int)$universe["id"],
        "isDefault" => (bool)$universe["is_default"]
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

  public function getUniverses($userId) {
    try {
      $qry = $this->pdo->prepare("
        SELECT wu.name,
               wu.slug,
               wu.abbr,
               wu.logo,
               wu.cover,
               wu.visibility,
               wt.c_primary,
               wt.c_primary_fg,
               CASE
                WHEN ? IS NULL THEN 6
                ELSE COALESCE(wr.role, 5)
              END AS role
        FROM world_universes wu
        LEFT JOIN world_themes wt ON wt.universe = wu.id AND wt.is_active = 1
        LEFT JOIN world_roles wr ON wr.universe = wu.id AND wr.user = COALESCE(?, -1)
        WHERE wu.is_active = 1 AND wu.visibility >= CASE
            WHEN ? IS NULL THEN 6
            ELSE COALESCE(wr.role, 5)
        END
        ORDER BY wu.is_default DESC,
                (wu.owner = ?) DESC,
                 wu.name ASC;
      ");

      $qry->execute([$userId, $userId, $userId, $userId]);
      $universes = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Universe retrieval failed".$e->getMessage());
    }

    if (!$universes) {
      return [];
    }

    return $universes ?: [];
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
