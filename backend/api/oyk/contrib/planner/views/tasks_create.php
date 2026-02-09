<?php

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), TRUE);

$title = trim($data["title"] ?? "");
$content = trim($data["content"] ?? "");
$priority = trim($data["priority"] ?? "medium");
$statusId = $data["statusId"] ?? "";
$universeSlug = $data["universe"] ?? NULL;
$universe = NULL;

// Validations
if (
  $title === "" || $priority === "" || $statusId === ""
) {
  Response::badRequest("Invalid data");
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
}
catch (Exception $e) {
  Response::serverError();
}

// Create new tasks status
$qry = $pdo->prepare("
  INSERT INTO planner_tasks (title, content, priority, status, author, universe)
  VALUES (:title, :content, :priority, :status, :author, :universe)
");

$qry->execute([
  "title" => $title,
  "content" => $content,
  "priority" => $priority,
  "status" => $statusId,
  "author" => $authUser["id"],
  "universe" => $universe ? $universe["id"] : NULL
]);

Response::json([
  "ok" => TRUE
]);
