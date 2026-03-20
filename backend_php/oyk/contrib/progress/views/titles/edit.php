<?php

global $pdo;
$userAuthId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $userAuthId);
$universeId = $context["id"];

// Check permissions
if (!$titleService->userCanEditTitle($universeId, $titleId, $userAuthId)) {
  Response::unauthorized("Permission denied");
}

// Validation
$fields = $titleService->validateData($_POST);

// Edit title
$titleService->updateTitle($universeId, $titleId, $fields);

Response::json([
  "ok" => TRUE,
]);
