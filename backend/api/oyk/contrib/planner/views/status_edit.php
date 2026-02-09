<?php

global $pdo;
$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), TRUE);

$title = trim($data["title"] ?? "");
$color = $data["color"] ?? NULL;
$position = $data["position"] ?? 1;

if ($title === "" || $position === "" || $position < 1) {
  Response::badRequest("Invalid data");
}

try {
  $qry = $pdo->prepare("
    SELECT title, color, position
    FROM planner_status
    WHERE id = ?
    LIMIT 1
  ");
  $qry->execute([$statusId]);
  $status = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$status) {
  Response::notFound("Status not found");
}

// Update tasks status
$qry = $pdo->prepare("
  UPDATE planner_status
  SET title=:title, color=:color, position=:position
  WHERE id=:id
");

$qry->execute([
  "id" => $statusId,
  "title" => $title,
  "color" => $color,
  "position" => $position
]);

Response::json([
  "ok" => TRUE
]);
