<?php

global $pdo;
$authId = require_rat();

$universeService = new UniverseService($pdo);
$userService = new UserService($pdo);
$characterService = new CharacterService($pdo);

$context = $universeService->getContext($universeSlug, $authId);
$universeId = $context["id"];
$universeIsDefault = $context["isDefault"];

if (!$universeId) {
  Response::notFound("Universe not found");
}

$characters = [];
$users = [];

$character = $characterService->getProfile($universeId, $characterSlug);

Response::json([
  "ok" => TRUE,
  "character" => $character ?: null,
]);
