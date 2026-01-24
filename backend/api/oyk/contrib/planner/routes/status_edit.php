<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

$statusId   = $data["status"] ?? "";
$title      = trim($data["title"] ?? "");
$color      = $data["color"] ?? null;
$position   = $data["position"] ?? 1;

// Validations
if (
    $statusId === "" || $title === "" || $position === "" || $position < 1
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

try {
    $qry = $pdo->prepare("
        SELECT title, color, position
        FROM planner_status
        WHERE id = :id
        LIMIT 1
    ");
    $qry->execute(["id" => $statusId]);
    $status = $qry->fetch();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

if (!$status) {
    http_response_code(404);
    echo json_encode(["error" => "Status not found"]);
    exit;
}

// Update tasks status
$qry = $pdo->prepare("
        UPDATE planner_status
        SET title=:title, color=:color, position=:position
        WHERE id=:id
");

$qry->execute([
    "id"        => $statusId,
    "title"     => $title,
    "color"     => $color,
    "position"  => $position
]);

echo json_encode([
    "ok" => true
]);
