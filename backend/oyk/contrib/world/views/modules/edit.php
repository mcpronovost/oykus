<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Validate
$fields = $moduleService->validateData($_POST);

$moduleName ??= $fields["name"];

// Check permissions
if (!$moduleService->userCanEditModule($moduleName, $authUser["id"])) {
  throw new AuthorizationException("You cannot edit module");
}

// Update
$moduleService->updateModule($moduleName, $universeId, $fields);

$module = $moduleService->getModules($universeId);

Response::json([
  "ok" => TRUE,
  "module" => $module[$moduleName]
]);
