<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);

/*
|--------------------------------------------------------------------------
| Get universe
|--------------------------------------------------------------------------
*/
$universeId = $universeService->getEditableUniverseId($universeSlug, $authUser["id"]);

if (!$universeId) {
  http_response_code(403);
  echo json_encode(["error" => "Universe not found"]);
  exit;
}

$theme = $themeService->getActiveTheme($universeId);

/*
|--------------------------------------------------------------------------
| Return resource
|--------------------------------------------------------------------------
*/

echo json_encode([
  "ok" => TRUE,
  "theme" => $theme
]);
