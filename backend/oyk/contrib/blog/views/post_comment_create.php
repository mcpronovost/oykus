<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$alertService = new AlertService($pdo);
$blogService = new BlogService($pdo);
$commentService = new CommentService($pdo);

$universeSlug ??= NULL;
$postId ??= 0;

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Check permissions
if (!$commentService->userCanAddComment($universeId, $postId, $userId)) {
  Response::notFound("Post not found");
}

// Validation
$fields = $commentService->validateData($_POST);

// Add comment
$comments = $commentService->createComment($postId, $userId, $fields);

// Create alert
$post = $blogService->getPost($universeId, $postId);
$alertService->createAlert(
  $post["author"],
  "New blog comment",
  "blog_comment",
  "blog_posts",
  $postId,
  [
    "universe_slug" => $universeSlug,
    "comment_id" => $comments[0]["id"],
    "comment_author" => $comments[0]["author"],
    "comment_content" => substr($comments[0]["content"], 0, 32),
    "post_id" => $postId,
    "post_title" => $post["title"]
  ]
);

Response::json([
  "ok" => TRUE,
  "comments" => $comments
]);
