<?php

class ModuleService {
  private array $allowedModules;

  public function __construct(private PDO $pdo) {
    $this->allowedModules = [
      "planner",
      "blog",
      "forum",
      "courrier",
      "collectibles",
      "rewards",
      "game",
      "leveling"
    ];
  }

  public function userCanEditModule(string $moduleName, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_modules wm
        LEFT JOIN world_universes wu ON wu.id = wm.universe
        WHERE wm.name = ? AND wu.owner = ?
      )
    ");
    $qry->execute([$moduleName, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function validateData(array $data): array {
    $fields = [];

    if (array_key_exists("module", $data)) {
      $module = $data["module"];
      if (!in_array($module, $this->allowedModules)) {
        throw new ValidationException("Invalid module");
      }
      $fields["name"] = $module;
    }

    if (array_key_exists("action", $data)) {
      $action = $data["action"];
      if ($action !== "activate" && $action !== "deactivate") {
        throw new ValidationException("Invalid action");
      }
      $fields["is_active"] = $action === "activate" ? 1 : 0;
    }

    return $fields;
  }

  public function getModules($universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT id, name, is_active, is_disabled, settings
        FROM world_modules
        WHERE universe = ?
        ORDER BY name ASC
      ");
      $qry->execute([$universeId]);
      $modules = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Module retrieval failed");
    }

    $missing_modules = $this->allowedModules;

    foreach ($modules as $m) {
      if (in_array($m["name"], $missing_modules)) {
        unset($missing_modules[$m["name"]]);
      }
    }

    if (count($missing_modules) > 0) {
      foreach ($missing_modules as $m) {
        $qry = $this->pdo->prepare("
          INSERT INTO world_modules (universe, name, settings)
          VALUES (?, ?, '{}')
          ON DUPLICATE KEY UPDATE name = name
        ");
        $qry->execute([$universeId, $m]);
      }

      try {
        $qry = $this->pdo->prepare("
          SELECT id, name, is_active, is_disabled, settings
          FROM world_modules
          WHERE universe = ?
          ORDER BY name ASC
        ");
        $qry->execute([$universeId]);
        $modules = $qry->fetchAll();
      }
      catch (Exception $e) {
        throw new QueryException("Module retrieval failed");
      }
    }

    $result = [];

    foreach ($modules as $m) {
      $result[$m["name"]] = [
        "name" => $m["name"],
        "active" => (bool) $m["is_active"],
        "disabled" => (bool) $m["is_disabled"],
        "settings" => json_decode($m["settings"])
      ];
    }

    return $result ?: [];
  }

  public function updateModule(string $moduleName, array $fields): void {
    if (empty($fields)) {
      throw new ValidationException("No fields to update");
    }

    $sqlParts = [];
    $params = [];

    foreach ($fields as $key => $value) {
      $sqlParts[] = "{$key} = :{$key}";
      $params[":{$key}"] = $value;
    }

    $params[":nameId"] = $moduleName;

    try {
      $sql = "
        UPDATE world_modules
        SET " . implode(", ", $sqlParts) . "
        WHERE name = :nameId
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute($params);
    }
    catch (Exception $e) {
      throw new QueryException("Module update failed".$e->getMessage());
    }
  }
}
