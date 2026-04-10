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
if (!$geoService->userCanEditZone($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot edit geographic zone");
}

// Update
$geoService->updateZone($universeId, $zoneId, $fields);

Response::json([
  "ok" => TRUE
]);
