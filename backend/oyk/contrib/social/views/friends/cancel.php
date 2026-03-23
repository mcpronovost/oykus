<?php

global $pdo;
$authUserId = require_rat();

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
    DELETE FROM social_friends
    WHERE (
        friend_id = ? AND user_id = ?
      ) OR (
        friend_id = ? AND user_id = ?
      )
      AND status = 'pending';
  ");

  $qry->execute([$user["id"], $authUserId, $authUserId, $user["id"]]);

  $deleted = $qry->rowCount();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$deleted) {
  Response::notFound("Friend request not found");
}

Response::json([
  "ok" => TRUE
]);
