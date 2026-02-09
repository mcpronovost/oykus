<?php

global $pdo;

$isProd = getenv("HTTP_ISPROD");
$authUser = require_auth(TRUE);

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

try {
  $qry = $pdo->prepare("
    DELETE FROM auth_wio
    WHERE user_id = ?
  ");

  $qry->execute([$authUser["id"]]);
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE
]);
