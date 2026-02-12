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

    if (array_key_exists("settings", $data)) {
      $decoded_json = json_decode($data["settings"], TRUE);

      foreach ($decoded_json as $key => $value) {
        if ($key === "display_name") {
          if (!is_string($value)) {
            throw new ValidationException("Invalid value for Display Name");
          }
          if (strlen($value) > 120) {
            throw new ValidationException("Display Name cannot be longer than 120 characters");
          }
        }
      }

      $fields["settings"] = json_encode($decoded_json);
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
      throw new QueryException("Module retrieval failed".$e->getMessage());
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

  public function getModule($universeId, $moduleName): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT id, name, is_active, is_disabled, settings
        FROM world_modules
        WHERE universe = ? AND name = ?
        LIMIT 1
      ");
      $qry->execute([$universeId, $moduleName]);
      $module = $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Module retrieval failed".$e->getMessage());
    }

    if (!$module) {
      try {
        $qry = $this->pdo->prepare("
          INSERT INTO world_modules (universe, name, settings)
          VALUES (?, ?, '{}')
          ON DUPLICATE KEY UPDATE name = name
        ");
        $qry->execute([$universeId, $moduleName]);
        $module = $qry->fetch();
      } catch (Exception $e) {
        throw new QueryException("Module retrieval failed".$e->getMessage());
      }
    }

    $result = [];

    $result[$module["name"]] = [
      "name" => $module["name"],
      "active" => (bool) $module["is_active"],
      "disabled" => (bool) $module["is_disabled"],
      "settings" => json_decode($module["settings"])
    ];

    return $result ?: [];
  }

  public function updateModule(string $moduleName, int $universeId, array $fields): void {
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
    $params[":universeId"] = $universeId;

    try {
      $sql = "
        UPDATE world_modules
        SET " . implode(", ", $sqlParts) . "
        WHERE name = :nameId AND universe = :universeId
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute($params);
    }
    catch (Exception $e) {
      throw new QueryException("Module update failed".$e->getMessage());
    }
  }
}
