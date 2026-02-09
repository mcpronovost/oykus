<?php

global $pdo;

$authUser = require_auth();

// Services
$taskService = new TaskService($pdo);

// Validations
$fields = $taskService->validateData($_POST);

// Check permissions
$isStatusOnlyUpdate = isset($fields["status"]) && count($fields) === 1;
if ($isStatusOnlyUpdate) {
  if (!$taskService->userCanMoveTask($taskId, $authUser["id"])) {
    throw new AuthorizationException("You cannot move this task");
  }
}
else {
  if (!$taskService->userCanEditTask($taskId, $authUser["id"])) {
    throw new AuthorizationException("You cannot edit this task");
  }
}

// Update
$taskService->updateTask($taskId, $fields);

Response::json([
  "ok" => TRUE
]);
