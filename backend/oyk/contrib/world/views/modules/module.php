<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Check permissions
if (!$moduleService->userCanEditModule($moduleName, $authUser["id"])) {
  throw new AuthorizationException("You cannot edit module");
}

$module = $moduleService->getModule($universeId, $moduleName);

Response::json([
  "ok" => TRUE,
  "module" => $module
]);
