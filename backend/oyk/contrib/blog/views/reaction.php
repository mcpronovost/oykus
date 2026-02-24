<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);
$reactionService = new ReactionService($pdo);

$universeSlug ??= NULL;
$postId ??= 0;

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Check permissions
if (!$reactionService->userCanAddReaction($universeId, $postId, $userId)) {
  Response::notFound("Post not found");
}

// Validation
$fields = $reactionService->validateData($_POST);

// Set reaction
$reactions = $reactionService->setReaction($postId, $userId, $fields["action"]);

Response::json([
  "ok" => TRUE,
  "reactions" => $reactions
]);
