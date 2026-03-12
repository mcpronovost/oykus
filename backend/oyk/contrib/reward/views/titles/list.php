<?php

global $pdo;
$userAuthId = require_rat();

$universeService = new UniverseService($pdo);
$titleService = new TitleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $userAuthId);
$universeId = $context["id"];

// Check permissions
// ...

// Get titles list
$titles = $titleService->getTitlesList($universeId);

Response::json([
  "ok" => TRUE,
  "titles" => $titles
]);
