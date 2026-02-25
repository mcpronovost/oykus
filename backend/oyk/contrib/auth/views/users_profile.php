<?php

global $pdo;
$userId = require_rat();

try {
  $qry = $pdo->prepare("
    SELECT name, slug, abbr, avatar, cover
    FROM auth_users
    WHERE slug = ?
    LIMIT 1
  ");

  $qry->execute([$userSlug]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$user) {
  Response::notFound("User not found");
}

Response::json([
  "ok" => TRUE,
  "user" => $user
]);
