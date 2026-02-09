<?php

global $pdo;
$authUser = require_auth();

// Services
$universeService = new UniverseService($pdo);
$statusService = new StatusService($pdo);

$universeSlug = $universeSlug ?? NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Validations
$fields = $statusService->validateCreateData($_POST);

// Create
$statusService->createStatus($universeId, $fields);

Response::json([
  "ok" => TRUE
]);
