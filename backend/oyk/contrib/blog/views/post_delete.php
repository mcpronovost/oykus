<?php

global $pdo;
$authUser = require_auth();

// Services
$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= NULL;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Check permissions
if (!$blogService->userCanDeletePost($universeId, $postId, $authUser["id"])) {
  Response::notFound("Post not found");
}

// Delete
$blogService->deletePost($postId);

Response::json([
  "ok" => TRUE
]);
