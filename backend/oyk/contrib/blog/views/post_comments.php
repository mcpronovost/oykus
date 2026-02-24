<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);
$commentService = new CommentService($pdo);

$universeSlug ??= null;
$postId ??= null;

// Validations
if (!$postId) {
  throw new NotFoundException("Post not found");
}

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

$module = $moduleService->getModule($universeId, "blog");
$moduleSettings = $module["blog"]["settings"];

// Get comments
if ((int) $moduleSettings["is_comments_enabled"] === 1) {
  $comments = $commentService->getCommentsForPost($postId, $userId);
}

Response::json([
  "ok" => TRUE,
  "comments" => $comments ?? []
]);
