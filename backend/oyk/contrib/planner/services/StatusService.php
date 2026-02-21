<?php

class StatusService {

  public function __construct(private PDO $pdo) {
  }

  public function userCanEditStatus(int $statusId, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM planner_statuses s
        LEFT JOIN world_universes u ON u.id = s.universe
        WHERE s.id = ? AND u.owner = ?
      )
    ");

    $qry->execute([
      $statusId,
      $userId
    ]);

    return (bool) $qry->fetchColumn();
  }

  public function userCanDeleteStatus(int $statusId, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM planner_statuses s
        LEFT JOIN world_universes u ON u.id = s.universe
        WHERE s.id = ? AND u.owner = ?
      )
    ");
    $qry->execute([$statusId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function getStatuses(int $universeId): array {
    $qry = $this->pdo->prepare("
      SELECT id, title, color, position, is_completed
      FROM planner_statuses
      WHERE universe = ?
      ORDER BY position ASC
    ");

    $qry->execute([
      $universeId
    ]);

    return $qry->fetchAll();
  }

  public function validateData(array $data): array {
    $fields = [];

    // Title
    if (array_key_exists("title", $data)) {
      $title = trim($data["title"]);
      if ($title === "") {
        throw new ValidationException("Title cannot be empty");
      }
      $fields["title"] = substr($title, 0, 120);
    }

    // Color
    if (array_key_exists("color", $data)) {
      $fields["color"] = trim($data["color"]);
    }

    // Position
    if (array_key_exists("position", $data)) {
      $position = (int) $data["position"];
      if ($position <= 0) {
        throw new ValidationException("Invalid position value");
      }
      $fields["position"] = $position;
    }

    return $fields;
  }

  public function validateCreateData(array $data): array {
    $data = $this->validateData($data);

    if (!isset($data["title"])) {
      throw new ValidationException("Missing title");
    }

    return [
      "title" => $data["title"],
      "color" => $data["color"] ?? NULL,
      "position" => $data["position"] ?? 1,
    ];
  }

  public function createStatus(int $universeId, array $fields): void {
    $position = $fields["position"];

    try {
      $this->pdo->beginTransaction();

      // 1. Shift all statuses after position
      $shift = $this->pdo->prepare("
        UPDATE planner_statuses
        SET position = position + 1
        WHERE universe = :universe
          AND position >= :position
        ORDER BY position DESC
      ");

      $shift->execute([
        "universe" => $universeId,
        "position" => $position
      ]);

      // 2. Insert new status
      $insert = $this->pdo->prepare("
        INSERT INTO planner_statuses (title, color, position, universe)
        VALUES (:title, :color, :position, :universe)
      ");

      $insert->execute([
        "title" => $fields["title"],
        "color" => $fields["color"],
        "position" => $position,
        "universe" => $universeId
      ]);

      $this->pdo->commit();
    }
    catch (Exception $e) {
      $this->pdo->rollBack();
      throw new QueryException("Status creation failed");
    }
  }

  public function updateStatus(int $statusId, array $fields): void {
    if (empty($fields)) {
      throw new ValidationException("No fields to update");
    }

    $sqlParts = [];
    $params = [];

    foreach ($fields as $key => $value) {
      $sqlParts[] = "{$key} = :{$key}";
      $params[":{$key}"] = $value;
    }

    $params[":id"] = $statusId;

    try {
      $sql = "
        UPDATE planner_statuses
        SET " . implode(", ", $sqlParts) . "
        WHERE id = :id
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute($params);
    }
    catch (Exception $e) {
      throw new QueryException("Status update failed");
    }
  }

  public function deleteStatus(int $statusId): void {
    try {
      $qry = $this->pdo->prepare("
        DELETE FROM planner_statuses
        WHERE id = ?
      ");
      $qry->execute([$statusId]);
    }
    catch (Exception $e) {
      throw new QueryException("Status deletion failed");
    }
  }
}
