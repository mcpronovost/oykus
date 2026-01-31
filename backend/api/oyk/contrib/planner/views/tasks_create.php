<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

$title        = trim($data["title"] ?? "");
$content      = trim($data["content"] ?? "");
$priority     = trim($data["priority"] ?? "medium");
$statusId     = $data["statusId"] ?? "";
$universeSlug = $data["universe"] ?? null;
$universe     = null;

// Validations
if (
    $title === "" || $priority === "" || $statusId === ""
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

// Get universe
try {
    if ($universeSlug) {
        $qry = $pdo->prepare("
            SELECT id
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

// Create new tasks status
$qry = $pdo->prepare("
    INSERT INTO planner_tasks (title, content, priority, status, author, universe)
    VALUES (:title, :content, :priority, :status, :author, :universe)
");

$qry->execute([
    "title"     => $title,
    "content"   => $content,
    "priority"  => $priority,
    "status"    => $statusId,
    "author"    => $authUser["id"],
    "universe"  => $universe ? $universe["id"] : null
]);

echo json_encode([
    "ok" => true
]);
