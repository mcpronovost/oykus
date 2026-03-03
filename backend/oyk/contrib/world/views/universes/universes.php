<?php

global $pdo;
$authId = require_rat(FALSE);

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniverses($authId);

Response::json([
  "ok" => TRUE,
  "universes" => $universes
]);
