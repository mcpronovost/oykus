<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Check permissions
if (!$titleService->userCanDeleteTitle($universeId, $titleId, $authUserId)) {
  Response::notFound("Title not found");
}

// Delete title
$titleService->deleteTitle($universeId, $titleId);

Response::json([
  "ok" => TRUE,
]);
