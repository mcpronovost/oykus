<?php

global $pdo;
$authUserId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Check permissions
if (!$blogService->userCanCreatePost($universeId, $authUserId)) {
  Response::notFound("Permission denied");
}

// Validation
$fields = $blogService->validateCreateData($_POST);

// Create post
$post = $blogService->createPost($universeId, $authUserId, $fields);

Response::json([
  "ok" => TRUE,
  "post" => $post
]);
