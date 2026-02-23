<?php

global $pdo;
$userId = require_rat(FALSE);

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniverses($userId ?? NULL);

Response::json([
  "ok" => TRUE,
  "universes" => $universes
]);
