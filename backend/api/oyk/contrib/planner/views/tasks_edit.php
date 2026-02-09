<?php

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), TRUE);

$title = trim($data["title"] ?? "") ?? NULL;
$content = trim($data["content"] ?? "") ?? NULL;
$priority = trim($data["priority"] ?? "") ?? NULL;
$dueAt = trim($data["dueAt"] ?? "") ?? NULL;
$statusId = trim($data["status"] ?? "") ?? NULL;

if ($dueAt === "")
  $dueAt = NULL;

// Validations
if (!$taskId) {
  http_response_code(400);
  echo json_encode(["error" => "Missing task"]);
  exit;
}

try {
  $qry = $pdo->prepare("
    SELECT EXISTS (
      SELECT 1
      FROM planner_tasks t
      WHERE id = ? AND (
        author = ?
        OR EXISTS (
          SELECT 1
          FROM planner_assignees ta
          WHERE ta.task_id = t.id
          AND ta.user_id = ?
        )
      )
    )
  ");
  $qry->execute([$taskId, $authUser["id"], $authUser["id"]]);
  $task = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$task) {
  Response::notFound("Task not found");
}

// Dynamically set fields and values
$fields = [];
$params = [];

if ($title) {
  $fields[] = "title = :title";
  $params[":title"] = substr($title, 0, 120);
}

if ($content) {
  $fields[] = "content = :content";
  $params[":content"] = $content;
}

if ($priority) {
  $fields[] = "priority = :priority";
  $params[":priority"] = $priority;
}

if ($dueAt) {
  $fields[] = "due_at = :dueAt";
  $params[":dueAt"] = $dueAt;
}

if ($statusId) {
  $fields[] = "status = :statusId";
  $params[":statusId"] = $statusId;
}

$params[":id"] = $taskId;

try {
  // Update tasks status
  $sql = "
    UPDATE planner_tasks
    SET " . implode(', ', $fields) . "
    WHERE id = :id
  ";

  $qry = $pdo->prepare($sql);
  $qry->execute($params);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
