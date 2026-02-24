<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Check permissions
if (!$moduleService->userCanEditModule($moduleName, $userId)) {
  throw new AuthorizationException("You cannot edit module");
}

$module = $moduleService->getModule($universeId, $moduleName);

Response::json([
  "ok" => TRUE,
  "module" => $module
]);
