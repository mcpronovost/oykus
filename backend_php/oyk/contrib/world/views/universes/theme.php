<?php

global $pdo;
$authId = require_rat(FALSE);

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);

$context = $universeService->getContext($universeSlug, $authId);
$universeId = $context["id"];

if (!$universeId) {
  Response::notFound("Universe not found");
}

$theme = $themeService->getActiveTheme($universeId);

Response::json([
  "ok" => TRUE,
  "theme" => $theme
]);
