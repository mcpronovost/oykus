<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load requested user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id
    FROM auth_users
    WHERE name = :name
    LIMIT 1
");
$qry->execute(["name" => $_POST["name"]]);
$user = $qry->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

try {
    $qry = $pdo->prepare("
        INSERT INTO auth_friends (user_id, friend_id)
        VALUES (:userId, :friendId)
    ");

    $qry->execute([
        "userId"    => $authUser["id"],
        "friendId"  => $user["id"]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

echo json_encode([
    "ok" => true
]);
