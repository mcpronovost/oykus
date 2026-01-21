<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

$title      = trim($data["title"] ?? "");
$color      = $data["color"] ?? null;
$position   = $data["position"] ?? 1;

// Validations
if (
    $title === "" || $position === "" || $position < 1
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

// Create new tasks status
$qry = $pdo->prepare("
    INSERT INTO tasks_status (title, color, position)
    VALUES (:title, :color, :position)
");

$qry->execute([
    "title"     => $title,
    "color"     => $color,
    "position"  => $position
]);

echo json_encode([
    "ok" => true
]);
