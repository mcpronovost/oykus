<?php

class GeoService {
  public function __construct(private PDO $pdo) {
  }

  public function userCanEditGeoList(int $universeId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes u
        WHERE u.id = ? AND u.owner_id = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function validateData(array $data): array {
    if (!array_key_exists("items", $data)) {
      throw new ValidationException("Missing items");
    }

    $items = $data["items"];

    if (is_string($items)) {
      $items = json_decode($items, TRUE);
    }

    if (!is_array($items)) {
      throw new ValidationException("Invalid items");
    }

    $allowedTypes = [
      "zone" => TRUE,
      "sector" => TRUE,
      "division" => TRUE,
    ];

    $validated = [];

    foreach ($items as $item) {
      if (is_object($item)) {
        $item = (array) $item;
      }

      if (!is_array($item)) {
        throw new ValidationException("Invalid item");
      }

      // ID
      if (!array_key_exists("id", $item)) {
        throw new ValidationException("Invalid id");
      }
      $id = filter_var($item["id"], FILTER_VALIDATE_INT, [
        "options" => [
          "min_range" => 1,
        ]
      ]);
      if ($id === FALSE) {
        throw new ValidationException("Invalid id");
      }

      // TYPE
      if (!array_key_exists("type", $item) || !is_string($item["type"]) || trim($item["type"]) === "") {
        throw new ValidationException("Invalid type");
      }
      $type = trim($item["type"]);
      if (!array_key_exists($type, $allowedTypes)) {
        throw new ValidationException("Invalid type");
      }

      // POSITION
      if (!array_key_exists("position", $item)) {
        throw new ValidationException("Invalid position");
      }
      $position = filter_var($item["position"], FILTER_VALIDATE_INT, [
        "options" => [
          "min_range" => 0,
        ]
      ]);
      if ($position === FALSE) {
        throw new ValidationException("Invalid position");
      }

      // PARENT ID
      if ($type === "sector" || $type === "division") {
        if (!array_key_exists("parentUid", $item)) {
          throw new ValidationException("Invalid parent");
        }
        $parent_uid = (int) explode(":", $item["parentUid"])[1];
        $parent_id = filter_var($parent_uid, FILTER_VALIDATE_INT, [
          "options" => [
            "min_range" => 1,
          ]
        ]);
        if ($parent_id === FALSE) {
          throw new ValidationException("Invalid parent");
        }
      }
      else {
        $parent_id = NULL;
      }

      $validated[] = [
        "type" => $type,
        "position" => (int) $position,
        "id" => (int) $id,
        "parentId" => (int) $parent_id,
      ];
    }

    return $validated;
  }

  public function getGeoList($universeId) {
    try {
      $qry = $this->pdo->prepare("SELECT
          z.id,
          'zone' AS type,
          CONCAT('zone:', z.id) AS uid,
          NULL AS parentId,
          NULL AS parentUid,
          z.name,
          z.position,
          1 AS sort_order
        FROM world_geo_zones z
        WHERE z.universe_id = ?

        UNION ALL

        SELECT
          s.id,
          'sector' AS type,
          CONCAT('sector:', s.id) AS uid,
          s.zone_id AS parentId,
          CONCAT('zone:', s.zone_id) AS parentUid,
          s.name,
          s.position,
          2 AS sort_order
        FROM world_geo_sectors s
        WHERE s.universe_id = ?

        UNION ALL

        SELECT
          d.id,
          'division' AS type,
          CONCAT('division:', d.id) AS uid,
          d.sector_id AS parentId,
          CONCAT('sector:', d.sector_id) AS parentUid,
          d.name,
          d.position,
          3 AS sort_order
        FROM world_geo_divisions d
        WHERE d.universe_id = ?

        ORDER BY sort_order ASC, parentId ASC, position ASC
      ");

      $qry->execute([$universeId, $universeId, $universeId]);
      $rows = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new NotFoundException("Geography not found" . $e->getMessage());
    }

    return $rows ?: [];
  }

  public function updateGeoList($universeId, $items) {
    $stmt = $this->pdo->prepare("
      UPDATE world_geo_zones SET position = :position WHERE id = :id AND universe_id = :universe_id
    ");
    $stmtSector = $this->pdo->prepare("
      UPDATE world_geo_sectors SET position = :position, zone_id = :parent_id WHERE id = :id AND universe_id = :universe_id
    ");
    $stmtDivision = $this->pdo->prepare("
      UPDATE world_geo_divisions SET position = :position, sector_id = :parent_id WHERE id = :id AND universe_id = :universe_id
    ");

    $stmtMap = [
      'zone' => $stmt,
      'sector' => $stmtSector,
      'division' => $stmtDivision,
    ];

    $this->pdo->beginTransaction();
    try {
      foreach ($items as $item) {
        if ($item['type'] === 'zone') {
          $stmtMap[$item['type']]->execute([
            ':position' => $item['position'],
            ':id' => $item['id'],
            ':universe_id' => $universeId,
          ]);
        }
        else {
          $stmtMap[$item['type']]->execute([
            ':position' => $item['position'],
            ':id' => $item['id'],
            ':universe_id' => $universeId,
            ':parent_id' => $item['parentId'],
          ]);
        }
      }
      $this->pdo->commit();
    }
    catch (Exception $e) {
      $this->pdo->rollBack();
      throw new QueryException("Geo update failed" . $e->getMessage());
    }
  }
}
