<?php

global $pdo;
$userId = require_rat();

// Services
$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Check permissions
if (!$blogService->userCanDeletePost($universeId, $postId, $userId)) {
  Response::notFound("Post not found");
}

// Delete
$blogService->deletePost($postId);

Response::json([
  "ok" => TRUE
]);
