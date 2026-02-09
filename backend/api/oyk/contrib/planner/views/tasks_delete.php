<?php

global $pdo;
$authUser = require_auth();

try {
  $qry = $pdo->prepare("
    SELECT EXISTS (
      SELECT 1
      FROM planner_tasks t
      WHERE id = ? AND (
        author = ?
      )
    )
  ");
  $qry->execute([$taskId, $authUser["id"]]);
  $task = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$task) {
  Response::notFound("Task not found");
}

try {
  $sql = "
    DELETE FROM planner_tasks
    WHERE id = ?
  ";
  $pdo->prepare($sql)->execute([$taskId]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
