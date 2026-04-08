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
if (!$geoService->userCanEditSector($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot edit geographic sector");
}

// Update
$geoService->updateSector($universeId, $sectorId, $fields);

Response::json([
  "ok" => TRUE
]);
