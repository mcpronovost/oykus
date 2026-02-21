<?php

global $pdo;
$authUser = require_auth();

try {
  $qry = $pdo->prepare("
    SELECT u.name, u.abbr, u.slug, u.avatar, u.cover
    FROM social_friends f
    JOIN auth_users u ON u.id = f.friend_id
    WHERE f.user_id = ?
        AND f.status = 'accepted'
    ORDER BY u.name ASC;
  ");

  $qry->execute([$authUser["id"]]);
  $friends = $qry->fetchAll();
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE,
  "friends" => $friends
]);
