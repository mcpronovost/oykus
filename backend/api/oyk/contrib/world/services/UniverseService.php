<?php

class UniverseService {
  public function __construct(private PDO $pdo) {}

  public function getContext(?string $slug, int $userId): array {
      // Default universe if no context
      if (!$slug) {
        $qry = $this->pdo->prepare("
          SELECT id, is_default
          FROM world_universes
          WHERE is_default = 1
          LIMIT 1
        ");
        $qry->execute();
      } else {
        $qry = $this->pdo->prepare("
          SELECT id, is_default
          FROM world_universes
          WHERE slug = ?
          LIMIT 1
        ");
        $qry->execute([$slug]);
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
               wt.c_primary,
               wt.c_primary_fg
        FROM world_universes wu
        LEFT JOIN world_themes wt ON wt.universe = wu.id AND wt.is_active = 1
        WHERE (wu.visibility = 4 OR
               wu.owner = ?) AND
               wu.is_active = 1
        ORDER BY wu.is_default DESC,
                (wu.owner = ?) DESC,
                 wu.name ASC;
      ");

      $qry->execute([$userId, $userId]);
      $universes = $qry->fetchAll();
    }
    catch (Exception $e) {
      return [];
    }

    return $universes ?: [];
  }
}
