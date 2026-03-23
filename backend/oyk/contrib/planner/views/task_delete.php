<?php

global $pdo;

$authUserId = require_rat();

// Services
$taskService = new TaskService($pdo);

// Check permissions
if (!$taskService->userCanDeleteTask($taskId, $authUserId)) {
  Response::notFound("Task not found");
}

// Delete
$taskService->deleteTask($taskId);

Response::json([
  "ok" => TRUE
]);
