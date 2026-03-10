<?php

global $pdo;
$userAuthId = require_rat();

try {
  $qry = $pdo->prepare("
    SELECT meta_socials
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

if (!empty($user["meta_socials"])) {
  $user["meta_socials"] = json_decode($user["meta_socials"], TRUE);
}

Response::json([
  "ok" => TRUE,
  "profile" => $user
]);
