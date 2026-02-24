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
        LEFT JOIN world_universes wu ON wu.id = wm.universe_id
        WHERE wm.label = ? AND wu.owner_id = ?
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
      $fields["label"] = $module;
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

  public function getModules(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wmc.id, wmc.label, wmc.is_available, wmc.settings
        FROM world_modules_core wmc
        LEFT JOIN world_modules wm
            ON wm.core_id = wmc.id AND wm.universe_id = ?
        WHERE wm.id IS NULL
          AND wmc.is_visible = 1
        ORDER BY wmc.label ASC
      ");
      $qry->execute([$universeId]);
      $core_modules = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Core modules retrieval failed" . $e->getMessage());
    }

    try {
      $qry = $this->pdo->prepare("
        SELECT wm.id, wm.label, wm.is_active, wm.is_disabled, wm.settings, wmc.is_available
        FROM world_modules wm
        LEFT JOIN world_modules_core wmc ON wmc.id = wm.core_id
        WHERE wm.universe_id = ? AND wmc.is_visible = 1
        ORDER BY wm.label ASC
      ");
      $qry->execute([$universeId]);
      $modules = $qry->fetchAll();
    }
    catch (Exception) {
      throw new QueryException("Module retrieval failed");
    }

    if (count($core_modules) > 0) {
      foreach ($core_modules as $m) {
        $qry = $this->pdo->prepare("
          INSERT INTO world_modules (universe_id, core_id, label, is_disabled, settings)
          VALUES (?, ?, ?, NOT ?, ?)
          ON DUPLICATE KEY UPDATE label = label
        ");
        $qry->execute([$universeId, $m["id"], $m["label"], $m["is_available"], $m["settings"]]);
      }

      try {
        $qry = $this->pdo->prepare("
          SELECT wm.id, wm.label, wm.is_active, wm.is_disabled, wm.settings, wmc.is_available
          FROM world_modules wm
          LEFT JOIN world_modules_core wmc ON wmc.id = wm.core_id
          WHERE wm.universe_id = ? AND wmc.is_visible = 1
          ORDER BY wm.label ASC
        ");
        $qry->execute([$universeId]);
        $modules = $qry->fetchAll();
      }
      catch (Exception $e) {
        throw new QueryException("Module retrieval failed" . $e->getMessage());
      }
    }

    $result = [];

    foreach ($modules as $m) {
      $result[$m["label"]] = [
        "label" => $m["label"],
        "active" => (bool) $m["is_active"],
        "disabled" => $m["is_disabled"] || !$m["is_available"],
        "settings" => json_decode($m["settings"], TRUE)
      ];
    }

    return $result ?: [];
  }

  public function getModule(int $universeId, string $moduleName): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wm.id, wm.label, wm.is_active, wm.is_disabled, wm.settings, wmc.is_available
        FROM world_modules wm
        LEFT JOIN world_modules_core wmc ON wmc.id = wm.core_id
        WHERE wm.universe_id = ? AND wm.label = ? AND wmc.is_visible = 1
        ORDER BY wm.label ASC
        LIMIT 1
      ");
      $qry->execute([$universeId, $moduleName]);
      $module = $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Module retrieval failed" . $e->getMessage());
    }

    $result = [];

    $result[$module["label"]] = [
      "label" => $module["label"],
      "active" => (bool) $module["is_active"],
      "disabled" => (bool) $module["is_disabled"] || !$module["is_available"],
      "settings" => json_decode($module["settings"], TRUE)
    ];

    return $result ?: [];
  }

  public function updateModule(string $moduleLabel, int $universeId, array $fields): void {
    if (empty($fields)) {
      throw new ValidationException("No fields to update");
    }

    $sqlParts = [];
    $params = [];

    foreach ($fields as $key => $value) {
      $sqlParts[] = "{$key} = :{$key}";
      $params[":{$key}"] = $value;
    }

    $params[":labelName"] = $moduleLabel;
    $params[":universeId"] = $universeId;

    try {
      $sql = "
        UPDATE world_modules
        SET " . implode(", ", $sqlParts) . "
        WHERE label = :labelName AND universe_id = :universeId
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute($params);
    }
    catch (Exception $e) {
      throw new QueryException("Module update failed" . $e->getMessage());
    }
  }
}
