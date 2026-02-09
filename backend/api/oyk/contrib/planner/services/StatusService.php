<?php

class StatusService {

  public function __construct(private PDO $pdo) {
  }

  public function getStatuses(?int $universeId, bool $isDefault): array {
    $qry = $this->pdo->prepare("
      SELECT id, title, color, position, is_completed
      FROM planner_status
      WHERE (? AND universe IS NULL)
         OR (? AND universe = ?)
      ORDER BY position ASC
    ");

    $qry->execute([
      $isDefault,
      !$isDefault,
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
        UPDATE planner_status
        SET position = position + 1
        WHERE universe = :universe
          AND position >= :position
        ORDER BY position DESC
      ");

      $shift->execute([
        "universe" => $universeId ?: NULL,
        "position" => $position
      ]);

      // 2. Insert new status
      $insert = $this->pdo->prepare("
        INSERT INTO planner_status (title, color, position, universe)
        VALUES (:title, :color, :position, :universe)
      ");

      $insert->execute([
        "title" => $fields["title"],
        "color" => $fields["color"],
        "position" => $position,
        "universe" => $universeId ?: NULL
      ]);

      $this->pdo->commit();
    }
    catch (Exception $e) {
      $this->pdo->rollBack();
      error_log(print_r($e, true));
      throw new QueryException("Status creation failed");
    }
  }
}
