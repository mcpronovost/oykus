<?php

global $pdo;
$authUser = require_auth();

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
    WHERE friend_id = :userId
      AND user_id = :friendId
      AND status = 'pending';
  ");

  $qry->execute([
    "userId" => $user["id"],
    "friendId" => $authUser["id"]
  ]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
