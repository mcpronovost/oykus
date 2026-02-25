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
    DELETE FROM social_friends
    WHERE 
      (
        (user_id = :userId AND friend_id = :targetFriendId)
        OR
        (user_id = :targetUserId AND friend_id = :friendId)
      )
      AND status = 'accepted';
  ");

  $qry->execute([
    "userId" => $userId,
    "targetFriendId" => $user["id"],
    "targetUserId" => $user["id"],
    "friendId" => $userId
  ]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
