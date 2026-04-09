<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Validate
$fields = $geoService->validateZoneData($_POST);

// Check permissions
if (!$geoService->userCanCreateGeoZone($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot create geographic zone");
}

// Update
$geoService->createZone($universeId, $fields);

Response::json([
  "ok" => TRUE
]);
