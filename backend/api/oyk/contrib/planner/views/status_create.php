<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

$title        = trim($data["title"] ?? "");
$color        = $data["color"] ?? null;
$position     = $data["position"] ?? 1;
$universeSlug = $data["universe"] ?? null;
$universe     = null;

// Validations
if (
    $title === "" || $position === "" || $position < 1
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
            FROM world_universes
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
    INSERT INTO planner_status (title, color, position, universe)
    VALUES (:title, :color, :position, :universe)
");

$qry->execute([
    "title"     => $title,
    "color"     => $color,
    "position"  => $position,
    "universe"  => $universe ? $universe["id"] : null
]);

echo json_encode([
    "ok" => true
]);
