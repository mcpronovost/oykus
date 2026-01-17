<?php

require_once __DIR__ . "/utils/jwt.php";

function require_auth(): array {
    $headers = getallheaders();
    $authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? "";

    if (!str_starts_with($authHeader, "Oyk ")) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $token = substr($authHeader, 4);
    $payload = decode_jwt($token);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    return $payload;
}