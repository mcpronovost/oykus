<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Validate
$fields = $geoService->validateSectorData($_POST);

// Check permissions
if (!$geoService->userCanCreateGeoSector($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot create geographic sector");
}

// Update
$geoService->createSector($universeId, $fields);

Response::json([
  "ok" => TRUE
]);
