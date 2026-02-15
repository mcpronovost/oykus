<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);
$commentService = new CommentService($pdo);

$universeSlug ??= NULL;
$postId ??= 0;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Check permissions
if (!$commentService->userCanAddComment($universeId, $postId, $authUser["id"])) {
  Response::notFound("Post not found");
}

// Validation
$fields = $commentService->validateData($_POST);

// Add comment
$comments = $commentService->createComment($postId, $authUser["id"], $fields);

Response::json([
  "ok" => TRUE,
  "comments" => $comments
]);
