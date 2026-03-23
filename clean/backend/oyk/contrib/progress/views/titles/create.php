<?php

global $pdo;
$userAuthId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $userAuthId);
$universeId = $context["id"];

// Check permissions
if (!$titleService->userCanCreateTitle($universeId, $userAuthId)) {
  Response::unauthorized("Permission denied");
}

// Validation
$fields = $titleService->validateCreateData($_POST);

// Create title
$titleService->createTitle($universeId, $fields);

Response::json([
  "ok" => TRUE,
]);
