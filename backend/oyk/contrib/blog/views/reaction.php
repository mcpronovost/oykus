<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);
$reactionService = new ReactionService($pdo);

$universeSlug ??= NULL;
$postId ??= 0;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Check permissions
if (!$reactionService->userCanAddReaction($universeId, $postId, $authUser["id"])) {
  Response::notFound("Post not found");
}

// Validation
$fields = $reactionService->validateData($_POST);

// Set reaction
$reactions = $reactionService->setReaction($postId, $authUser["id"], $fields["action"]);

Response::json([
  "ok" => TRUE,
  "reactions" => $reactions
]);
