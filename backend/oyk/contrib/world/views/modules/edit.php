<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Validate
$fields = $moduleService->validateData($_POST);

$moduleName ??= $fields["label"];

// Check permissions
if (!$moduleService->userCanEditModule($moduleName, $authUserId)) {
  throw new AuthorizationException("You cannot edit module");
}

// Update
$moduleService->updateModule($moduleName, $universeId, $fields);

$module = $moduleService->getModule($universeId, $moduleName);

Response::json([
  "ok" => TRUE,
  "module" => $module
]);
