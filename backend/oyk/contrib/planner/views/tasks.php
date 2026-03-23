<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$statusService = new StatusService($pdo);
$taskService = new TaskService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Statuses
$statuses = $statusService->getStatuses($universeId);

// Tasks per status
foreach ($statuses as &$s) {
  $s["tasks"] = $taskService->getTasksForStatus(
    $s["id"],
    $authUserId,
    $universeId
  );
}
unset($s);

Response::json([
  "ok" => TRUE,
  "tasks" => $statuses
]);
