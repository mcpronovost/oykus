<?php

global $pdo;
$authId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authId);
$universeId = $context["id"];

// Check permissions
if (!$moduleService->userCanEditModule($moduleName, $authId)) {
  throw new AuthorizationException("You cannot edit module");
}

$module = $moduleService->getModule($universeId, $moduleName);

Response::json([
  "ok" => TRUE,
  "module" => $module
]);
