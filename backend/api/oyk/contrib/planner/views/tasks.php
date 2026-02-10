<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$statusService = new StatusService($pdo);
$taskService = new TaskService($pdo);

$universeSlug = $universeSlug ?? null;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Statuses
$statuses = $statusService->getStatuses($universeId);

// Tasks per status
foreach ($statuses as &$s) {
  $s["tasks"] = $taskService->getTasksForStatus(
    $s["id"],
    $authUser["id"],
    $universeId
  );
}

Response::json([
  "ok" => TRUE,
  "tasks" => $statuses
]);
