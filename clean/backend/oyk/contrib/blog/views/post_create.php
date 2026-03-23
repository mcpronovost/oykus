<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Check permissions
if (!$blogService->userCanCreatePost($universeId, $userId)) {
  Response::notFound("Permission denied");
}

// Validation
$fields = $blogService->validateCreateData($_POST);

// Create post
$post = $blogService->createPost($universeId, $userId, $fields);

Response::json([
  "ok" => TRUE,
  "post" => $post
]);
