<?php

global $pdo;
$authUser = require_auth(FALSE);

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);
$moduleService = new ModuleService($pdo);

$universe = $universeService->getUniverse($universeSlug, $authUser["id"]);
$theme = $themeService->getActiveTheme($universe["id"]);
$modules = $moduleService->getModules($universe["id"]);

$universe["modules"] = $modules;

Response::json([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
