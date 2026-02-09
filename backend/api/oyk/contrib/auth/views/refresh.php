<?php

$refreshToken = $_COOKIE["oyk-rat"] ?? NULL;

if (!$refreshToken) {
  Response::forbidden("Invalid token");
}

$payload = decode_jwt($refreshToken);

// Optional: check jti in DB (revocation / rotation)

$newAccessToken = generate_jwt([
  "id" => $payload["id"],
  "exp" => time() + 900
]);

Response::json([
  "ok" => TRUE,
  "rat" => $newAccessToken
]);
