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
$fields = $commentService->validateCreateData($_POST);

// Add comment
$comments = $commentService->createComment($universeId, $postId, $userId, $fields);

// Create alert
$post = $blogService->getPost($universeId, $postId);

try {
  $alertService->createAlert(
    $post["author_id"],
    "New blog comment",
    "blog_comment",
    "blog_posts",
    $postId,
    [
      "universe_slug" => $universeSlug,
      "comment_id" => $comments[0]["id"],
      "comment_author" => $comments[0]["author"]["id"],
      "comment_content" => substr($comments[0]["content"], 0, 32),
      "post_id" => $postId,
      "post_title" => $post["title"]
    ]
  );
}
catch (Exception) {
  // fail silently
}

Response::json([
  "ok" => TRUE,
  "comments" => $comments
]);
