<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
$blogService = new BlogService($pdo);

$universeSlug ??= null;

// Universe context
$context = $universeService->getContext($universeSlug, $authUser["id"]);
$universeId = $context["id"];

// Get post
$posts = $blogService->getPostsList($universeId);

Response::json([
  "ok" => TRUE,
  "posts" => $posts
]);
