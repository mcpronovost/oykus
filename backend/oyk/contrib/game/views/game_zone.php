<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

$zone = $geoService->getWorldZone($universeId, $zoneId);

Response::json([
  "ok" => TRUE,
  "zone" => $zone
]);
