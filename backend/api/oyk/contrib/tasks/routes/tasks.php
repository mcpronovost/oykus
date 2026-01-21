<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$tasks = [];

try {
    // Fetch all statuses
    $statusQry = $pdo->prepare("
        SELECT id, title, color, position, is_completed
        FROM tasks_status
        ORDER BY position ASC
    ");
    $statusQry->execute();
    $tasks = $statusQry->fetchAll();

    // Prepare tasks query (with priority ordering)
    $tasksQry = $pdo->prepare("
    SELECT
        t.id,
        t.title,
        t.content,
        t.priority,
        t.due_at,
        t.status,

        COALESCE(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', u.name,
                        'avatar', u.avatar,
                        'slug', u.slug,
                        'abbr', u.abbr
                    )
                )
                FROM tasks_assignees ta
                JOIN users u ON u.id = ta.user_id
                WHERE ta.task_id = t.id
            ),
            JSON_ARRAY()
        ) AS assignees

    FROM tasks t
    WHERE
        t.status = :status_id
        AND (
            t.author = :user_id
            OR EXISTS (
                SELECT 1
                FROM tasks_assignees ta2
                WHERE ta2.task_id = t.id
                AND ta2.user_id = :assignee_id
            )
        )

    ORDER BY
        FIELD(t.priority, 'low', 'medium', 'high') DESC,
        t.due_at IS NULL,
        t.due_at ASC
    ");

    // Attach tasks to each status
    foreach ($tasks as &$s) {
        $tasksQry->execute([
            "status_id" => $s["id"],
            "user_id"   => $authUser["id"],
            "assignee_id" => $authUser["id"]
        ]);

        $s["tasks"] = array_map(function ($task) {
            $task["assignees"] = json_decode($task["assignees"], true);
            return $task;
        }, $tasksQry->fetchAll());
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
