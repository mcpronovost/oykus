<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Check permissions
if (!$blogService->userCanCreatePost($universeId, $authUser["id"])) {
  Response::notFound("Permission denied");
}

// Validation
$fields = $blogService->validateCreateData($_POST);

// Create post
$post = $blogService->createPost($universeId, $authUser["id"], $fields);

Response::json([
  "ok" => TRUE,
  "post" => $post
]);
