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
$pdo->beginTransaction();
try {
  $qry = $pdo->prepare("
    UPDATE auth_friends
    SET status = 'accepted', responded_at = NOW()
    WHERE user_id = :userId
      AND friend_id = :friendId
      AND status = 'pending';
  ");
  $qry->execute([
    "userId" => $user["id"],
    "friendId" => $authUser["id"]
  ]);

  $qry = $pdo->prepare("
    INSERT INTO auth_friends (user_id, friend_id, status, responded_at)
    VALUES (:userId, :friendId, 'accepted', NOW())
    ON DUPLICATE KEY UPDATE
      status = 'accepted',
      responded_at = NOW()
  ");

  $qry->execute([
    "userId" => $authUser["id"],
    "friendId" => $user["id"]
  ]);

  $pdo->commit();
}
catch (Exception $e) {
  $pdo->rollBack();
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
