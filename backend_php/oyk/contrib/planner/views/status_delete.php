<?php

global $pdo;

$authUserId = require_rat();

// Services
$statusService = new StatusService($pdo);

// Check permissions
if (!$statusService->userCanDeleteStatus($statusId, $authUserId)) {
  Response::notFound("Status not found");
}

// Delete
$statusService->deleteStatus($statusId);

Response::json([
  "ok" => TRUE
]);
