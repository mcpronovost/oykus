<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load requesting user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id
    FROM auth_users
    WHERE slug = :slug
    LIMIT 1
");
$qry->execute(["slug" => $_POST["slug"]]);
$user = $qry->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Update friend request
|--------------------------------------------------------------------------
*/
try {
    $qry = $pdo->prepare("
        UPDATE auth_friends
        SET status = 'rejected', responded_at = NOW()
        WHERE user_id = :userId
            AND friend_id = :friendId
            AND status = 'pending';
    ");

    $qry->execute([
        "userId"    => $user["id"],
        "friendId"  => $authUser["id"]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

echo json_encode([
    "ok" => true
]);
