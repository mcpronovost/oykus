<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$tasks = [];
$universeSlug = $_GET["universe"] ?? null;

// Get universe
try {
    if ($universeSlug) {
        $qry = $pdo->prepare("
            SELECT id, is_default
            FROM game_universes
            WHERE slug = ?
            LIMIT 1
        ");
        $qry->execute([$universeSlug]);
        $universe = $qry->fetch();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Universe not found"]);
    exit;
}

$universeId = $universe ? $universe["id"] : null;
$isDefault  = !$universe || ($universe && $universe["is_default"]) ? true : null;

try {
    // Fetch statuses
    $statusQry = $pdo->prepare("
        SELECT id, title, color, position, is_completed
        FROM planner_status
        WHERE (? IS NOT NULL AND universe IS NULL)
           OR (? IS NOT NULL AND universe = ?)
        ORDER BY position ASC
    ");
    $statusQry->execute([$isDefault, $universeId, $universeId]);
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
                FROM planner_assignees ta
                JOIN auth_users u ON u.id = ta.user_id
                WHERE ta.task_id = t.id
            ),
            JSON_ARRAY()
        ) AS assignees,

        COALESCE(
            (
                SELECT JSON_OBJECT(
                    'name', au.name,
                    'avatar', au.avatar,
                    'slug', au.slug,
                    'abbr', au.abbr
                )
                FROM auth_users au
                WHERE t.author = au.id
                LIMIT 1
            ),
            NULL
        ) AS author

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
            (:isUniverseDefault IS NOT NULL AND universe IS NULL)
            OR (:universeId1 IS NOT NULL AND universe = :universeId2)
        )

    ORDER BY
        t.priority DESC,
        t.due_at IS NULL,
        t.due_at ASC
    ");

    // Attach tasks to each status
    foreach ($tasks as &$s) {
        $tasksQry->execute([
            "status_id"   => $s["id"],
            "user_id"     => $authUser["id"],
            "assignee_id" => $authUser["id"],
            "isUniverseDefault" => $isDefault,
            "universeId1" => $universeId,
            "universeId2" => $universeId,
        ]);

        $s["tasks"] = array_map(function ($task) {
            $task["assignees"] = json_decode($task["assignees"], true);
            $task["author"] = json_decode($task["author"], true);
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
