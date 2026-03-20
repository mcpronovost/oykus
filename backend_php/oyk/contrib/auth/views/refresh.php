<?php

global $pdo;

$authService = new AuthService($pdo);

$refreshToken = $_COOKIE["oyk-rat"] ?? NULL;

if (!$refreshToken) {
  Response::forbidden("Invalid token");
}

$payload = decode_jwt($refreshToken);

// Optional: check jti in DB (revocation / rotation)

$newAccessToken = $authService->getRat($payload["id"]);

Response::json([
  "ok" => TRUE,
  "rat" => $newAccessToken
]);
