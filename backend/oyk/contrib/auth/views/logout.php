<?php

global $pdo;

$isProd = getenv("HTTP_ISPROD");
$userId = require_rat(FALSE);

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

if ($userId) {
  try {
    $qry = $pdo->prepare("
      DELETE FROM auth_wio
      WHERE user_id = ?
    ");

    $qry->execute([$userId]);
  }
  catch (Exception $e) {
    Response::serverError();
  }
}

Response::json([
  "ok" => TRUE
]);
