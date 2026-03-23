<?php

global $pdo;
$authUserId = require_rat(FALSE);

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniversesForUser($authUserId);

Response::json([
  "ok" => TRUE,
  "universes" => $universes
]);
