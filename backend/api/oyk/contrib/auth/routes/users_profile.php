<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT name, slug, abbr, avatar, cover
        FROM auth_users
        WHERE slug = :slug
        LIMIT 1
    ");

    $qry->execute(["slug" => $userSlug]);
    $user = $qry->fetch();
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
