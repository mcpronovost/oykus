<?php

global $pdo;
$authUserId = require_rat(FALSE);

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniverses($authUserId);

Response::json([
  "ok" => TRUE,
  "universes" => $universes
]);
