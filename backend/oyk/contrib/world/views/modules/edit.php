<?php

global $pdo;
$authId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authId);
$universeId = $context["id"];

// Validate
$fields = $moduleService->validateData($_POST);

$moduleName ??= $fields["label"];

// Check permissions
if (!$moduleService->userCanEditModule($moduleName, $authId)) {
  throw new AuthorizationException("You cannot edit module");
}

// Update
$moduleService->updateModule($moduleName, $universeId, $fields);

$module = $moduleService->getModules($universeId);

Response::json([
  "ok" => TRUE,
  "module" => $module[$moduleName]
]);
