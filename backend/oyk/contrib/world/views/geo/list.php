<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

$geo = $geoService->getGeoList($universeId);

Response::json([
  "ok" => TRUE,
  "geo" => $geo
]);
