<?php

header("Content-Type: application/json");

global $pdo;

$refreshToken = $_COOKIE["oyk-rat"] ?? null;

if (!$refreshToken) {
    http_response_code(403);
    exit;
}

$payload = decode_jwt($refreshToken);

// Optional: check jti in DB (revocation / rotation)

$newAccessToken = generate_jwt([
    "id" => $payload["id"],
    "exp" => time() + 900
]);

echo json_encode([
    "ok"  => true,
    "rat" => $newAccessToken
]);
