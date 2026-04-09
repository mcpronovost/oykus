<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

$sector = $geoService->getWorldSector($universeId, $sectorId);

Response::json([
  "ok" => TRUE,
  "sector" => $sector
]);
