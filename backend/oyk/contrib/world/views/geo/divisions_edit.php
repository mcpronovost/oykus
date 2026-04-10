<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$geoService = new GeoService($pdo);

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Validate
$fields = $geoService->validateDivisionData($_POST);

// Check permissions
if (!$geoService->userCanEditDivision($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot edit geographic division");
}

// Update
$geoService->updateDivision($universeId, $divisionId, $fields);

Response::json([
  "ok" => TRUE
]);
