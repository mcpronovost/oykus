<?php

global $pdo;
$authUser = require_auth();

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
  "alerts" => 0,
  "friends" => $friends,
  "messages" => 0,
]);
