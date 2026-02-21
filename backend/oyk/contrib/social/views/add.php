<?php

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load requested user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id
    FROM auth_users
    WHERE name = ?
    LIMIT 1
");
$qry->execute([$_POST["name"]]);
$user = $qry->fetch();

if (!$user) {
  Response::notFound("User not found");
}

/*
|--------------------------------------------------------------------------
| Check for pending request
|--------------------------------------------------------------------------
*/
try {
  $qry = $pdo->prepare("
    SELECT status, responded_at
    FROM social_friends
    WHERE 
      (user_id = :userId AND friend_id = :targetFriendId)
      OR
      (user_id = :targetUserId AND friend_id = :friendId)
    LIMIT 1
  ");
  $qry->execute([
    "userId" => $authUser["id"],
    "targetFriendId" => $user["id"],
    "targetUserId" => $user["id"],
    "friendId" => $authUser["id"]
  ]);
  $pending = $qry->fetch();

  if ($pending && $pending["status"] == "accepted") {
    Response::conflict("You are already friends");
  }
  if ($pending && $pending["status"] == "pending") {
    Response::conflict("A friend request is already pending");
  }
  if (
    ($pending && $pending["status"] == "rejected") &&
    ($pending["responded_at"] && $pending["responded_at"] >= date("Y-m-d H:i:s", strtotime("-7 days")))) {
    Response::conflict("You cannot send a friend request to this user");
  }
  if ($pending && $pending["status"] == "blocked") {
    Response::conflict("You cannot send a friend request to this user");
  }
}
catch (Exception $e) {
  Response::serverError();
}

/*
|--------------------------------------------------------------------------
| Add pending request
|--------------------------------------------------------------------------
*/
try {
  $qry = $pdo->prepare("
    INSERT INTO social_friends (user_id, friend_id, requested_at, responded_at)
    VALUES (:userId, :friendId, NOW(), NULL)
    ON DUPLICATE KEY UPDATE
      status = 'pending',
      requested_at = NOW(),
      responded_at = NULL
  ");

  $qry->execute([
    "userId" => $authUser["id"],
    "friendId" => $user["id"]
  ]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
