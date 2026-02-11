<?php

global $pdo;
$authUser = require_auth(FALSE);

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);

$universe = $universeService->getUniverse($universeSlug, $authUser["id"]);
$theme = $themeService->getActiveTheme($universe["id"]);

Response::json([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
