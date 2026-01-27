<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

$title      = trim($data["title"] ?? "") ?? null;
$content    = trim($data["content"] ?? "") ?? null;
$priority   = trim($data["priority"] ?? "") ?? null;
$dueAt      = trim($data["dueAt"] ?? "") ?? null;
$statusId   = trim($data["status"] ?? "") ?? null;

if ($dueAt === "") $dueAt = null;

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
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

if (!$task) {
    http_response_code(404);
    echo json_encode(["error" => "Task not found"]);
    exit;
}

// Dynamically set fields and values
$fields = [];
$params = [];

if ($title) {
    $fields[] = "title = :title";
    $params[":title"] = $title;
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

// Update tasks status
$sql = "
    UPDATE planner_tasks
    SET ".implode(', ', $fields)."
    WHERE id = :id
";

$qry = $pdo->prepare($sql);
$qry->execute($params);

echo json_encode([
    "ok" => true
]);
