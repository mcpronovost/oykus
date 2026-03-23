<?php

global $pdo;
$authId = require_rat(FALSE);

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);
$moduleService = new ModuleService($pdo);
$characterService = new CharacterService($pdo);

$universe = $universeService->getUniverse($universeSlug, $authId);
$theme = $themeService->getActiveTheme($universe["id"]);
$modules = $moduleService->getModules($universe["id"]);
$character = $characterService->getActiveCharacter($universe["id"]);

$universe["modules"] = $modules;

Response::json([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme,
  "character" => $character
]);
