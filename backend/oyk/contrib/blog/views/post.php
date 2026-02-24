<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$moduleService = new ModuleService($pdo);
$blogService = new BlogService($pdo);
$reactionService = new ReactionService($pdo);

$universeSlug ??= NULL;
$postId ??= NULL;

// Validations
if (!$postId) {
  throw new NotFoundException("Post not found");
}

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

$module = $moduleService->getModule($universeId, "blog");
$moduleSettings = $module["blog"]["settings"];

// Get post
$post = $blogService->getPost($universeId, $postId);
if ((int) ($moduleSettings['is_reactions_enabled'] ?? 0) === 1) {
  $reactions = $reactionService->getReactionsForPost($postId, $userId);
}

Response::json([
  "ok" => TRUE,
  "post" => $post,
  "reactions" => $reactions ?? []
]);
