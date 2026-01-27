<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT COUNT(*)
        FROM auth_friends
        WHERE friend_id = :id AND status = 'pending'
    ");

    $qry->execute(["id" => $authUser["id"]]);
    $friends = $qry->fetchColumn();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

echo json_encode([
    "ok"       => true,
    "alerts"   => 0,
    "friends"  => $friends,
    "messages" => 0,
]);
