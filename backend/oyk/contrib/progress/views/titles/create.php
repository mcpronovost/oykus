<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Check permissions
if (!$titleService->userCanCreateTitle($universeId, $authUserId)) {
  Response::unauthorized("Permission denied");
}

// Validation
$fields = $titleService->validateCreateData($_POST);

// Create title
$titleService->createTitle($universeId, $fields);

Response::json([
  "ok" => TRUE,
]);
