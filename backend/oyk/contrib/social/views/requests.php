<?php

global $pdo;
$authUser = require_auth();

try {
  $qry = $pdo->prepare("
    SELECT u.name, u.abbr, u.slug, u.avatar, f.requested_at
    FROM social_friends f
    JOIN auth_users u ON u.id = f.user_id
    WHERE f.friend_id = ?
        AND f.status = 'pending'
    ORDER BY f.requested_at DESC;
  ");

  $qry->execute([$authUser["id"]]);
  $requests = $qry->fetchAll();

  $qry = $pdo->prepare("
    SELECT u.name, u.abbr, u.slug, u.avatar, f.requested_at
    FROM social_friends f
    JOIN auth_users u ON u.id = f.friend_id
    WHERE f.user_id = ?
        AND f.status = 'pending'
    ORDER BY f.requested_at DESC;
  ");

  $qry->execute([$authUser["id"]]);
  $pendings = $qry->fetchAll();
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE,
  "requests" => $requests,
  "pendings" => $pendings
]);
