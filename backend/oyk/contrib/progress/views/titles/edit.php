<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Check permissions
if (!$titleService->userCanEditTitle($universeId, $titleId, $authUserId)) {
  Response::unauthorized("Permission denied");
}

// Validation
$fields = $titleService->validateData($_POST);

// Edit title
$titleService->updateTitle($universeId, $titleId, $fields);

Response::json([
  "ok" => TRUE,
]);
