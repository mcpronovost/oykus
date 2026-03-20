<?php

global $pdo;

$authUserId = require_rat();

// Services
$statusService = new StatusService($pdo);

// Validations
$fields = $statusService->validateData($_POST);

// Check permissions
if (!$statusService->userCanEditStatus($statusId, $authUserId)) {
  throw new AuthorizationException("You cannot edit this status");
}

// Update
$statusService->updateStatus($statusId, $fields);

Response::json([
  "ok" => TRUE
]);
