<?php

header("Content-Type: application/json");

require __DIR__ . "/../../../core/middlewares.php";
require __DIR__ . "/../../../core/db.php";

// 🔐 bloque si pas auth
$authUser = require_auth();

// $authUser contient le payload du JWT
// ex: sub, username, iat, exp...

try {
    $stmt = $pdo->prepare("
        SELECT name, slug, abbr
        FROM users
        WHERE id = :id
        LIMIT 1
    ");

    $stmt->execute(["id" => $authUser["sub"]]);
    $user = $stmt->fetch();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

echo json_encode([
    "ok" => true,
    "user" => $user
]);
