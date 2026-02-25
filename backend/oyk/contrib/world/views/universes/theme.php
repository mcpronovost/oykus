<?php

global $pdo;
$userId = require_rat(FALSE);

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);

$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

if (!$universeId) {
  Response::notFound("Universe not found");
}

$theme = $themeService->getActiveTheme($universeId);

Response::json([
  "ok" => TRUE,
  "theme" => $theme
]);
