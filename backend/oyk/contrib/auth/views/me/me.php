<?php

global $pdo;
$authUser = require_auth();

try {
  $qry = $pdo->prepare("
    SELECT id, name, slug, abbr, avatar, cover, is_dev, timezone
    FROM auth_users
    WHERE id = ?
    LIMIT 1
  ");

  $qry->execute([$authUser["id"]]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$user) {
  Response::notFound("User not found");
}

if (!$user["is_dev"]) {
  unset($user["is_dev"]);
}

Response::json([
  "ok" => TRUE,
  "user" => $user
]);
