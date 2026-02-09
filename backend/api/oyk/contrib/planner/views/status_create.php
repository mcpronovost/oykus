<?php

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), TRUE);

$title = trim($data["title"] ?? "");
$color = $data["color"] ?? NULL;
$position = $data["position"] ?? 1;
$universeSlug = $data["universe"] ?? NULL;
$universe = NULL;

// Validations
if (
  $title === "" || $position === "" || $position < 1
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
  INSERT INTO planner_status (title, color, position, universe)
  VALUES (:title, :color, :position, :universe)
");

$qry->execute([
  "title" => $title,
  "color" => $color,
  "position" => $position,
  "universe" => $universe ? $universe["id"] : NULL
]);

Response::json([
  "ok" => TRUE
]);
