<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

$universeSlug = $universeSlug ?? NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Validate
$fields = $moduleService->validateData($_POST);

// Check permissions
if (!$moduleService->userCanEditModule($fields["name"], $authUser["id"])) {
  throw new AuthorizationException("You cannot edit module");
}

// Update
$moduleService->updateModule($fields["name"], $fields);

$module = $moduleService->getModules($universeId);

Response::json([
  "ok" => TRUE,
  "module" => $module
]);
