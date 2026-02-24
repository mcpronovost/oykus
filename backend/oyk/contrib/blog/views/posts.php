<?php

global $pdo;
$userId = require_rat();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= null;

// Universe context
$context = $universeService->getContext($universeSlug, $userId);
$universeId = $context["id"];

// Get post
$posts = $blogService->getPostsList($universeId);

Response::json([
  "ok" => TRUE,
  "posts" => $posts
]);
