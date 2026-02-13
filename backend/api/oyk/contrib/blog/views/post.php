<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= null;
$postId ??= null;

// Validations
if (!$postId) {
  throw new NotFoundException("Post not found");
}

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Get post
$post = $blogService->getPost($universeId, $postId);

Response::json([
  "ok" => TRUE,
  "post" => $post
]);
