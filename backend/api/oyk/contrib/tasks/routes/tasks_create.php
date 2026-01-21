<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

$title      = trim($data["title"] ?? "");
$content    = trim($data["content"] ?? "");
$priority   = trim($data["priority"] ?? "medium");
$statusId   = $data["statusId"] ?? "";

// Validations
if (
    $title === "" || $priority === "" || $statusId === ""
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

// Create new tasks status
$qry = $pdo->prepare("
    INSERT INTO tasks (title, content, priority, status, author)
    VALUES (:title, :content, :priority, :status, :author)
");

$qry->execute([
    "title"     => $title,
    "content"   => $content,
    "priority"  => $priority,
    "status"    => $statusId,
    "author"    => $authUser["id"]
]);

echo json_encode([
    "ok" => true
]);
