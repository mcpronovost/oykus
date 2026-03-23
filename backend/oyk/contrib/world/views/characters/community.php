<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$userService = new UserService($pdo);
$characterService = new CharacterService($pdo);

$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];
$universeIsDefault = $context["isDefault"];

if (!$universeId) {
  Response::notFound("Universe not found");
}

$characters = [];
$users = [];

$universeIsDefault ? $users = $userService->getCommunity() : $characters = $characterService->getCommunity($universeId);

Response::json([
  "ok" => TRUE,
  "characters" => $characters,
  "users" => $users,
]);
