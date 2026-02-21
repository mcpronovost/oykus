<?php

class TaskService {

  public function __construct(private PDO $pdo) {
  }

  public function userCanEditTask(int $taskId, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM planner_tasks t
        LEFT JOIN world_universes u ON u.id = t.universe
        WHERE t.id = ?
          AND (
            t.author = ? OR u.owner = ?
          )
      )
    ");

    $qry->execute([
      $taskId,
      $userId,
      $userId
    ]);

    return (bool) $qry->fetchColumn();
  }

  public function userCanMoveTask(int $taskId, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM planner_tasks t
        LEFT JOIN world_universes u ON u.id = t.universe
        WHERE t.id = ?
          AND (
              t.author = ?
            OR u.owner = ?
            OR EXISTS (
                SELECT 1
                FROM planner_assignees ta
                WHERE ta.task_id = t.id
                  AND ta.user_id = ?
              )
          )
      )
    ");

    $qry->execute([$taskId, $userId, $userId, $userId]);

    return (bool) $qry->fetchColumn();
  }

  public function userCanDeleteTask(int $taskId, int $userId): bool {
    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM planner_tasks t
        LEFT JOIN world_universes u ON u.id = t.universe
        WHERE t.id = ?
          AND (
            t.author = ? OR u.owner = ?
          )
      )
    ");
    $qry->execute([$taskId, $userId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function getTasksForStatus(
    int $statusId,
    int $userId,
    int $universeId,
  ): array {

    $qry = $this->pdo->prepare("
      SELECT
          t.id,
          t.title,
          t.content,
          t.priority,
          t.due_at,
          t.status,

          COALESCE((
              SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'name', u.name,
                      'avatar', u.avatar,
                      'slug', u.slug,
                      'abbr', u.abbr
                  )
              )
              FROM planner_assignees ta
              JOIN auth_users u ON u.id = ta.user_id
              WHERE ta.task_id = t.id
          ), JSON_ARRAY()) AS assignees,

          COALESCE((
              SELECT JSON_OBJECT(
                  'name', au.name,
                  'avatar', au.avatar,
                  'slug', au.slug,
                  'abbr', au.abbr
              )
              FROM auth_users au
              WHERE t.author = au.id
              LIMIT 1
          ), NULL) AS author

      FROM planner_tasks t
      WHERE
          t.status = :status_id
          AND (
              t.author = :user_id
              OR EXISTS (
                  SELECT 1
                  FROM planner_assignees ta2
                  WHERE ta2.task_id = t.id
                  AND ta2.user_id = :assignee_id
              )
          )
          AND (
              universe = :universeId
          )

      ORDER BY
          t.priority DESC,
          t.due_at IS NULL,
          t.due_at ASC
    ");

    $qry->execute([
      "status_id" => $statusId,
      "user_id" => $userId,
      "assignee_id" => $userId,
      "universeId" => $universeId,
    ]);

    return array_map(function ($task) {
      $task["assignees"] = json_decode($task["assignees"], TRUE);
      $task["author"] = json_decode($task["author"], TRUE);
      return $task;
    }, $qry->fetchAll());
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

    // Content
    if (array_key_exists("content", $data)) {
      $fields["content"] = trim($data["content"]);
    }

    // Priority
    if (array_key_exists("priority", $data)) {
      $priority = (int) $data["priority"];
      if (!in_array($priority, [1, 2, 3], TRUE)) {
        throw new ValidationException("Invalid priority value");
      }
      $fields["priority"] = $priority;
    }

    // Due date
    if (array_key_exists("dueAt", $data)) {
      $dueAt = trim($data["dueAt"]);

      if ($dueAt === "") {
        $fields["due_at"] = NULL;
      }
      else {
        $timestamp = strtotime($dueAt);
        if ($timestamp === FALSE) {
          throw new ValidationException("Invalid date format for due date");
        }
        $fields["due_at"] = date("Y-m-d", $timestamp);
      }
    }

    // Status
    if (array_key_exists("status", $data)) {
      $status = (int) $data["status"];
      if ($status <= 0) {
        throw new ValidationException("Invalid status ID");
      }
      $fields["status"] = $status;
    }

    return $fields;
  }

  public function validateCreateData(array $data): array {
    $data = $this->validateData($data);

    if (!isset($data["title"])) {
      throw new ValidationException("Missing title");
    }

    if (!isset($data["status"])) {
      throw new ValidationException("Missing status");
    }

    return [
      "title" => $data["title"],
      "content" => $data["content"] ?? NULL,
      "priority" => $data["priority"] ?? 2,
      "status" => $data["status"],
      "due_at" => $data["due_at"] ?? NULL,
    ];
  }

  public function createTask(int $universeId, int $userId, array $fields): void {
    try {
      $sql = "
        INSERT INTO planner_tasks (title, content, priority, status, author, universe)
        VALUES (:title, :content, :priority, :status, :author, :universe)
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute([
        "title" => $fields["title"],
        "content" => $fields["content"],
        "priority" => $fields["priority"],
        "status" => $fields["status"],
        "author" => $userId,
        "universe" => $universeId ?: NULL
      ]);
    }
    catch (Exception $e) {
      throw new QueryException("Task creation failed");
    }
  }

  public function updateTask(int $taskId, array $fields): void {
    if (empty($fields)) {
      throw new ValidationException("No fields to update");
    }

    $sqlParts = [];
    $params = [];

    foreach ($fields as $key => $value) {
      $sqlParts[] = "{$key} = :{$key}";
      $params[":{$key}"] = $value;
    }

    $params[":id"] = $taskId;

    try {
      $sql = "
        UPDATE planner_tasks
        SET " . implode(", ", $sqlParts) . "
        WHERE id = :id
      ";

      $qry = $this->pdo->prepare($sql);
      $qry->execute($params);
    }
    catch (Exception $e) {
      throw new QueryException("Task update failed");
    }
  }

  public function deleteTask(int $taskId): void {
    try {
      $qry = $this->pdo->prepare("
        DELETE FROM planner_tasks
        WHERE id = ?
      ");
      $qry->execute([$taskId]);
    }
    catch (Exception $e) {
      throw new QueryException("Task deletion failed");
    }
  }
}
