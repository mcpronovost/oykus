<?php

global $pdo;

$isProd = getenv("HTTP_ISPROD");
$authUserId = require_rat(FALSE);

setcookie(
  "oyk-rat",
  "",
  [
    "expires" => time() - 3600,
    "path" => "/",
    "secure" => $isProd,
    "httponly" => TRUE,
    "samesite" => $isProd ? "Lax" : "None",
  ]
);

if ($authUserId) {
  try {
    $qry = $pdo->prepare("
      DELETE FROM auth_wio
      WHERE user_id = ?
    ");

    $qry->execute([$authUserId]);
  }
  catch (Exception $e) {
    Response::serverError();
  }
}

Response::json([
  "ok" => TRUE
]);
