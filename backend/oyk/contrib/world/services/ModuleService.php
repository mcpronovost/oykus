<?php

class ModuleService {
  private array $allowedModules;

  public function __construct(private PDO $pdo) {
    $this->allowedModules = [
      "planner" => 1,
      "blog" => 1,
      "forum" => 0,
      "collection" => 0,
      "progress" => 1,
      "game" => 1,
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
      if (!array_key_exists($module, $this->allowedModules) || !$this->allowedModules[$module]) {
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
          if (trim($value) === "") {
            unset($decoded_json[$key]);
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
        SELECT wm.id, wm.label, wm.is_active, wm.is_disabled, wm.settings
        FROM world_modules wm
        WHERE wm.universe_id = ?
        ORDER BY wm.label ASC
      ");
      $qry->execute([$universeId]);
      $modules = $qry->fetchAll();
    }
    catch (Exception) {
      throw new QueryException("Module retrieval failed");
    }

    if (count($modules) !== count($this->allowedModules)) {
      foreach ($this->allowedModules as $m => $enabled) {
        $qry = $this->pdo->prepare("
          INSERT INTO world_modules (universe_id, label, is_disabled, settings)
          VALUES (?, ?, not ?, ?)
          ON DUPLICATE KEY UPDATE label = label
        ");
        $qry->execute([$universeId, $m, FALSE, "{}"]);
      }

      try {
        $qry = $this->pdo->prepare("
          SELECT wm.id, wm.label, wm.is_active, wm.is_disabled, wm.settings
          FROM world_modules wm
          WHERE wm.universe_id = ?
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
      $allowed = (bool) ((int) $this->allowedModules[$m["label"]]);
      $result[$m["label"]] = [
        "label" => $m["label"],
        "active" => (bool) $m["is_active"] && (bool) !$m["is_disabled"] && $allowed,
        "disabled" => (bool) $m["is_disabled"] || !$allowed,
        "settings" => json_decode($m["settings"], TRUE)
      ];
    }

    return $result ?: [];
  }

  public function getModule(int $universeId, string $moduleName): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wm.id, wm.label, wm.is_active, wm.is_disabled, wm.settings
        FROM world_modules wm
        WHERE wm.universe_id = ? AND wm.label = ?
        ORDER BY wm.label ASC
        LIMIT 1
      ");
      $qry->execute([$universeId, $moduleName]);
      $module = $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Module retrieval failed" . $e->getMessage());
    }

    $allowed = (bool) ((int) $this->allowedModules[$module["label"]]);

    $result = [
      "label" => $module["label"],
      "active" => (bool) $module["is_active"] && $allowed,
      "disabled" => (bool) $module["is_disabled"] || !$allowed,
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
