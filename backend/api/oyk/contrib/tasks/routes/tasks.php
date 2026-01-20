<?php

header("Content-Type: application/json");

require OYK_PATH."/core/middlewares.php";
require OYK_PATH."/core/db.php";

$authUser = require_auth();

$tasks = [];

try {
    // Fetch all statuses
    $statusQry = $pdo->prepare("
        SELECT id, title, color, position
        FROM tasks_status
        ORDER BY position ASC
    ");
    $statusQry->execute();
    $tasks = $statusQry->fetchAll(PDO::FETCH_ASSOC);

    // Prepare tasks query (with priority ordering)
    $tasksQry = $pdo->prepare("
        SELECT id, title, content, priority, due_at, status
        FROM tasks
        WHERE status = :status_id AND author = :author
        ORDER BY FIELD(priority, 'low', 'medium', 'high') DESC,
                 due_at IS NULL,
                 due_at ASC
    ");

    // Attach tasks to each status
    foreach ($tasks as &$s) {
        $tasksQry->execute([
            "status_id" => $s["id"],
            "author"    => $authUser["id"]
        ]);
        $s["tasks"] = $tasksQry->fetchAll(PDO::FETCH_ASSOC);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

echo json_encode([
    "ok" => true,
    "tasks" => $tasks
]);
