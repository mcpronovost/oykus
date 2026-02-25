<?php

global $pdo;
$userId = require_rat();

try {
  $qry = $pdo->prepare("
    SELECT username, email, timezone
    FROM auth_users
    WHERE id = ?
    LIMIT 1
  ");

  $qry->execute([$userId]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  throw new QueryException();
}

if (!$user) {
  throw new NotFoundException("User not found");
}

Response::json([
  "ok" => TRUE,
  "account" => $user
]);
