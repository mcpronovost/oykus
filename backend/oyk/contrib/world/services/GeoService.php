<?php

require OYK . "/core/utils/formatters.php";

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

  public function userCanCreateGeoSector(int $universeId, int $userId): bool {
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

  public function userCanEditSector(int $universeId, int $userId): bool {
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

  public function validateListData(array $data): array {
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

  public function validateSectorData(array $data): array {
    if (is_object($data)) {
      $data = (array) $data;
    }

    if (!is_array($data)) {
      throw new ValidationException("Invalid sector data");
    }

    // Zone Id
    if (!array_key_exists("zone_id", $data)) {
      throw new ValidationException("Invalid Zone Id");
    }
    $zone_id = filter_var($data["zone_id"], FILTER_VALIDATE_INT, [
      "options" => [
        "min_range" => 1,
      ]
    ]);
    if ($zone_id === FALSE) {
      throw new ValidationException("Invalid Zone ID");
    }

    // NAME
    if (!array_key_exists("name", $data) || !is_string($data["name"]) || trim($data["name"]) === "") {
      throw new ValidationException("Invalid name");
    }
    $name = trim($data["name"]);
    $slug = get_slug($this->pdo, $name, "world_geo_sectors");

    // DESCRIPTION
    if (!array_key_exists("description", $data) || !is_string($data["description"])) {
      throw new ValidationException("Invalid description");
    }
    $description = trim($data["description"]);

    // VISIBILITY
    if (!array_key_exists("visibility", $data)) {
      throw new ValidationException("Invalid visibility");
    }
    $visibility = filter_var($data["visibility"], FILTER_VALIDATE_INT, [
      "options" => [
        "min_range" => 1,
        "max_range" => 6,
      ]
    ]);
    if ($visibility === FALSE) {
      throw new ValidationException("Invalid visibility");
    }

    // POSITION
    if (!array_key_exists("position", $data)) {
      throw new ValidationException("Invalid position");
    }
    $position = filter_var($data["position"], FILTER_VALIDATE_INT, [
      "options" => [
        "min_range" => 0,
      ]
    ]);
    if ($position === FALSE) {
      throw new ValidationException("Invalid position");
    }

    // COLUMN WIDTH
    if (!array_key_exists("col", $data)) {
      throw new ValidationException("Invalid column width");
    }
    $col = filter_var($data["col"], FILTER_VALIDATE_INT, [
      "options" => [
        "min_range" => 1,
        "max_range" => 100,
      ]
    ]);
    if ($col === FALSE) {
      throw new ValidationException("Invalid column width");
    }

    // LOCKED
    if (array_key_exists("is_locked", $data)) {
      $is_locked = $data["is_locked"] == "true" ? 1 : 0;
    }

    $fields = [
      "zone_id" => (int) $zone_id,
      "name" => $name,
      "slug" => $slug,
      "description" => $description,
      "visibility" => (int) $visibility,
      "position" => (int) $position,
      "col" => (int) $col,
      "is_locked" => (int) $is_locked,
    ];

    return $fields;
  }

  public function getWorldList(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("SELECT
          z.id,
          z.name,
          z.slug,
          z.visibility,
          z.position,

          COALESCE((
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', s.id,
                'name', s.name,
                'slug', s.slug,
                'position', s.position,
                'col', s.col
              )
            )
            FROM world_geo_sectors s
            WHERE s.zone_id = z.id
          ), JSON_ARRAY()) AS sectors

        FROM world_geo_zones z
        WHERE z.universe_id = ?

        ORDER BY position ASC
      ");

      $qry->execute([$universeId]);

      $rows = array_map(function ($r) {
        $r["sectors"] = json_decode($r["sectors"], TRUE);
        return $r;
      }, $qry->fetchAll());
    }
    catch (Exception $e) {
      throw new NotFoundException("Geography not found" . $e->getMessage());
    }

    return $rows ?: [];
  }

  public function getGeoList(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("SELECT
          z.id,
          'zone' AS type,
          CONCAT('zone:', z.id) AS uid,
          NULL AS parentId,
          NULL AS parentUid,
          z.name,
          z.slug,
          z.visibility,
          z.position,
          0 AS col,
          0 AS is_locked,
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
          s.slug,
          s.visibility,
          s.position,
          s.col,
          s.is_locked,
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
          d.slug,
          d.visibility,
          d.position,
          d.col,
          d.is_locked,
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

  public function updateGeoList(int $universeId, array $items): void {
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

  public function createSector(int $universeId, array $fields): void {
    try {
      $sql = "
        INSERT INTO world_geo_sectors (universe_id, zone_id, name, slug, description, visibility, position, col, is_locked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute([
        $universeId,
        $fields["zone_id"],
        $fields["name"],
        $fields["slug"],
        $fields["description"],
        $fields["visibility"],
        $fields["position"],
        $fields["col"],
        $fields["is_locked"],
      ]);
    }
    catch (Exception $e) {
      throw new QueryException("Geographic sector creation failed");
    }
  }

  public function updateSector(int $universeId, int $sectorId, array $fields): void {
    try {
      $qry = $this->pdo->prepare("UPDATE world_geo_sectors
        SET name = :name, slug = :slug, description = :description, visibility = :visibility, position = :position, col = :col, is_locked = :is_locked
        WHERE id = :id AND universe_id = :universe_id
      ");
      $qry->execute([
        ":name" => $fields["name"],
        ":slug" => $fields["slug"],
        ":description" => $fields["description"],
        ":visibility" => $fields["visibility"],
        ":position" => $fields["position"],
        ":col" => $fields["col"],
        ":is_locked" => $fields["is_locked"],
        ":id" => $sectorId,
        ":universe_id" => $universeId,
      ]);
    }
    catch (Exception $e) {
      $this->pdo->rollBack();
      throw new QueryException("Sector update failed" . $e->getMessage());
    }
  }
}
