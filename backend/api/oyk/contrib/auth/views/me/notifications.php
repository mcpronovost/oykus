<?php

global $pdo;
$authUser = require_auth();

try {
  $qry = $pdo->prepare("
    SELECT title, tag, payload
    FROM courrier_alerts
    WHERE recipient = :id AND is_read = 0
    ORDER BY created_at DESC
    LIMIT 10
  ");

  $qry->execute(["id" => $authUser["id"]]);
  $alerts = $qry->fetchAll();

  foreach ($alerts as &$a) {
    $a["payload"] = json_decode($a["payload"]);
  }
}
catch (Exception $e) {
  Response::serverError();
}

try {
  $qry = $pdo->prepare("
    SELECT COUNT(*)
    FROM auth_friends
    WHERE friend_id = :id AND status = 'pending'
  ");

  $qry->execute(["id" => $authUser["id"]]);
  $friends = $qry->fetchColumn();
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE,
  "alerts" => $alerts,
  "friends" => $friends,
  "messages" => 0,
]);
