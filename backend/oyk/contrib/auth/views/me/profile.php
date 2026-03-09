<?php

global $pdo;
$userAuthId = require_rat();

try {
  $qry = $pdo->prepare("
    SELECT meta_bio,
           meta_birthday,
           meta_country,
           meta_job,
           meta_mood,
           created_at
    FROM auth_users
    WHERE id = ?
    LIMIT 1
  ");

  $qry->execute([$userAuthId]);
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
  "profile" => $user
]);
