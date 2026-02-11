<?php

global $pdo;
$authUser = require_auth(FALSE);

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniverses($authUser["id"] ?? NULL);

Response::json([
  "ok" => TRUE,
  "universes" => $universes
]);
