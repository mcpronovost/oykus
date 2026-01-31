<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

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
            )
        )
    ");
    $qry->execute([$taskId, $authUser["id"]]);
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

try {
    $sql = "
        DELETE FROM planner_tasks
        WHERE id = ?
    ";
    $pdo->prepare($sql)->execute([$taskId]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

echo json_encode([
    "ok" => true
]);
