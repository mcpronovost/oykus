<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Check permissions
// ...

// Get titles list
$titles = $titleService->getTitlesList($universeId);

Response::json([
  "ok" => TRUE,
  "titles" => $titles
]);
