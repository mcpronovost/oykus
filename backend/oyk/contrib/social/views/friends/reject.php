<?php

global $pdo;
$userId = require_rat();

/*
|--------------------------------------------------------------------------
| Load requesting user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
  SELECT id
  FROM auth_users
  WHERE slug = ?
  LIMIT 1
");
$qry->execute([$_POST["slug"]]);
$user = $qry->fetch();

if (!$user) {
  Response::notFound("User not found");
}

/*
|--------------------------------------------------------------------------
| Update friend request
|--------------------------------------------------------------------------
*/
try {
  $qry = $pdo->prepare("
    UPDATE social_friends
    SET status = 'rejected', responded_at = NOW()
    WHERE user_id = ?
      AND friend_id = ?
      AND status = 'pending';
  ");

  $qry->execute([$user["id"], $userId]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
