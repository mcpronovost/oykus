<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$commentService = new CommentService($pdo);

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
$comments = $commentService->getCommentsForPost($postId, $authUser["id"]);

Response::json([
  "ok" => TRUE,
  "comments" => $comments
]);
