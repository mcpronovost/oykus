<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Validate
$fields = $geoService->validateData($_POST);

// Check permissions
if (!$geoService->userCanEditGeoList($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot edit geography");
}

// Update
$geoService->updateGeoList($universeId, $fields);

Response::json([
  "ok" => TRUE
]);
