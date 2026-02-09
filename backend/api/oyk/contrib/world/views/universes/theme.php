<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);

$universeId = $universeService->getEditableUniverseId($universeSlug, $authUser["id"]);

if (!$universeId) {
  Response::notFound("Universe not found");
}

$theme = $themeService->getActiveTheme($universeId);

Response::json([
  "ok" => TRUE,
  "theme" => $theme
]);
