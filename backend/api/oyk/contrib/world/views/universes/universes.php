<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniverses($authUser["id"]);

echo json_encode([
  "ok" => TRUE,
  "universes" => $universes
]);
