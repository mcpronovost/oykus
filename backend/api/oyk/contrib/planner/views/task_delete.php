<?php

global $pdo;

$authUser = require_auth();

// Services
$taskService = new TaskService($pdo);

// Check permissions
if (!$taskService->userCanDeleteTask($taskId, $authUser["id"])) {
  Response::notFound("Task not found");
}

// Delete
$taskService->deleteTask($taskId);

Response::json([
  "ok" => TRUE
]);
