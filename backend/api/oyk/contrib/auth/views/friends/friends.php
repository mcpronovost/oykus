<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT u.name, u.abbr, u.slug, u.avatar, u.cover
        FROM auth_friends f
        JOIN auth_users u ON u.id = f.friend_id
        WHERE f.user_id = :id
            AND f.status = 'accepted'
        ORDER BY u.name ASC;
    ");

    $qry->execute(["id" => $authUser["id"]]);
    $friends = $qry->fetchAll();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

echo json_encode([
    "ok"        => true,
    "friends"   => $friends
]);
