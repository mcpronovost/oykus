<?php

global $pdo;
$authUserId = require_rat();

// Services
$universeService = new UniverseService($pdo);
$taskService = new TaskService($pdo);

$universeSlug = $universeSlug ?? NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Validations
$fields = $taskService->validateCreateData($_POST);

// Create
$taskService->createTask($universeId, $authUserId, $fields);

Response::json([
  "ok" => TRUE
]);
