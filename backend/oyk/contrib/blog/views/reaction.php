<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);
$reactionService = new ReactionService($pdo);

$universeSlug ??= NULL;
$commentId ??= NULL;
$postId ??= NULL;

$targetId = $commentId ?? $postId;

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Check permissions
if (!$reactionService->userCanAddReaction($universeId, $commentId, $postId, $userId)) {
  Response::notFound("Target not found");
}

// Validation
$fields = $reactionService->validateData($_POST);

// Set reaction
$reactions = $reactionService->setReaction($universeId, $fields["target_tag"], $targetId, $userId, $fields["action"]);

Response::json([
  "ok" => TRUE,
  "reactions" => $reactions
]);
