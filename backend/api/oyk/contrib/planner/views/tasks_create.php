<?php

global $pdo;
$authUser = require_auth();

// Services
$universeService = new UniverseService($pdo);
$taskService = new TaskService($pdo);

$universeSlug = $universeSlug ?? NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Validations
$fields = $taskService->validateCreateData($_POST);

// Create
$taskService->createTask($universeId, $authUser["id"], $fields);

Response::json([
  "ok" => TRUE
]);
