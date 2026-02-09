<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);

$universes = $universeService->getUniverses($authUser["id"]);

Response::json([
  "ok" => TRUE,
  "universes" => $universes
]);
