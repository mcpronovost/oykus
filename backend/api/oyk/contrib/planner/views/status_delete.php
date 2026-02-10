<?php

global $pdo;

$authUser = require_auth();

// Services
$statusService = new StatusService($pdo);

// Check permissions
if (!$statusService->userCanDeleteStatus($statusId, $authUser["id"])) {
  Response::notFound("Status not found");
}

// Delete
$statusService->deleteStatus($statusId);

Response::json([
  "ok" => TRUE
]);
