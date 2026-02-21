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
    DELETE FROM auth_friends
    WHERE 
      (
        (user_id = :userId AND friend_id = :targetFriendId)
        OR
        (user_id = :targetUserId AND friend_id = :friendId)
      )
      AND status = 'accepted';
  ");

  $qry->execute([
    "userId" => $authUser["id"],
    "targetFriendId" => $user["id"],
    "targetUserId" => $user["id"],
    "friendId" => $authUser["id"]
  ]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
