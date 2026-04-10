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
if (!$geoService->userCanCreateGeoDivision($universeId, $authUserId)) {
  throw new AuthorizationException("You cannot create geographic division");
}

// Update
$geoService->createDivision($universeId, $fields);

Response::json([
  "ok" => TRUE
]);
