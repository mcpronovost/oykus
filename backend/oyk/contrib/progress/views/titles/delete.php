<?php

global $pdo;
$userAuthId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $userAuthId);
$universeId = $context["id"];

// Check permissions
if (!$titleService->userCanDeleteTitle($universeId, $titleId, $userAuthId)) {
  Response::notFound("Title not found");
}

// Delete title
$titleService->deleteTitle($universeId, $titleId);

Response::json([
  "ok" => TRUE,
]);
