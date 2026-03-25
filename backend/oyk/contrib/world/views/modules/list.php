<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

$modules = $moduleService->getModules($universeId);

Response::json([
  "ok" => TRUE,
  "modules" => $modules
]);
