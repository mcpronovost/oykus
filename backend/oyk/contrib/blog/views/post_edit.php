<?php

global $pdo;
$authUserId = require_rat();

// Services
$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUserId);
$universeId = $context["id"];

// Check permissions
if (!$blogService->userCanEditPost($universeId, $postId, $authUserId)) {
  Response::notFound("Post not found");
}

// Validation
$fields = $blogService->validateData($_POST);

// Update post
$blogService->updatePost($postId, $universeId, $fields);

// Get post
$post = $blogService->getPost($universeId, $postId);

Response::json([
  "ok" => TRUE,
  "post" => $post
]);
