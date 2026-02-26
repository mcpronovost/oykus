<?php

class StatusService {

  public function __construct(private PDO $pdo) {
  }

  public function userCanEditStatus(int $statusId, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM planner_statuses s
        LEFT JOIN world_universes u ON u.id = s.universe_id
        WHERE s.id = ? AND u.owner_id = ?
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
        LEFT JOIN world_universes u ON u.id = s.universe_id
        WHERE s.id = ? AND u.owner_id = ?
      )
    ");
    $qry->execute([$statusId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function getStatuses(int $universeId): array {
    $qry = $this->pdo->prepare("
      SELECT id, title, color, position, is_completed
      FROM planner_statuses
      WHERE universe_id = ?
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

    error_log(print_r($data, TRUE));

    // Completed
    if (array_key_exists("is_completed", $data)) {
      $is_completed = (string) trim($data["is_completed"]);

      if ($is_completed === "true") {
        $fields["is_completed"] = 1;
      } else {
        $fields["is_completed"] = 0;
      }
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
        WHERE universe_id = :universe
          AND position >= :position
        ORDER BY position DESC
      ");

      $shift->execute([
        "universe" => $universeId,
        "position" => $position
      ]);

      // 2. Insert new status
      $insert = $this->pdo->prepare("
        INSERT INTO planner_statuses (title, color, position, universe_id)
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
    // Special case: position change
    if (isset($fields["position"])) {
      $newPosition = (int) $fields["position"];
      unset($fields["position"]); // remove from generic update

      // Perform reorder
      $this->updateStatusPosition($statusId, $newPosition);
    }

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
      throw new QueryException("Status update failed" . $e->getMessage());
    }
  }

  public function updateStatusPosition(int $statusId, int $newPosition): void {
    $this->pdo->beginTransaction();

    try {
        // Fetch current position
        $stmt = $this->pdo->prepare("
            SELECT position
            FROM planner_statuses
            WHERE id = :id
        ");
        $stmt->execute([":id" => $statusId]);
        $row = $stmt->fetch();

        if (!$row) {
            throw new Exception("Status not found");
        }

        $old = (int)$row["position"];

        if ($old === $newPosition) {
            $this->pdo->commit();
            return;
        }

        // STEP 1 — Lift moving row out of the way
        $this->pdo->prepare("
            UPDATE planner_statuses
            SET position = 255
            WHERE id = :id
        ")->execute([":id" => $statusId]);

        // STEP 2 — Shift other rows
        if ($old < $newPosition) {
            // Move DOWN
            $this->pdo->prepare("
                UPDATE planner_statuses
                SET position = position - 1
                WHERE position > :old AND position <= :new
            ")->execute([
                ":old" => $old,
                ":new" => $newPosition
            ]);
        } else {
            // Move UP
            $this->pdo->prepare("
                UPDATE planner_statuses
                SET position = position + 1
                WHERE position >= :new AND position < :old
            ")->execute([
                ":old" => $old,
                ":new" => $newPosition
            ]);
        }

        // STEP 3 — Place moving row
        $this->pdo->prepare("
            UPDATE planner_statuses
            SET position = :new
            WHERE id = :id
        ")->execute([
            ":new" => $newPosition,
            ":id" => $statusId
        ]);

        $this->pdo->commit();
    }
    catch (Exception $e) {
        $this->pdo->rollBack();
        throw $e;
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
