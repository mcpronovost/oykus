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

/*
|--------------------------------------------------------------------------
| Check for pending request
|--------------------------------------------------------------------------
*/
try {
    $qry = $pdo->prepare("
        SELECT status, responded_at
        FROM auth_friends
        WHERE 
            (user_id = :userId AND friend_id = :targetFriendId)
            OR
            (user_id = :targetUserId AND friend_id = :friendId)
        LIMIT 1
    ");
    $qry->execute([
        "userId"            => $authUser["id"],
        "friendId"          => $authUser["id"],
        "targetUserId"      => $user["id"],
        "targetFriendId"    => $user["id"]
    ]);
    $pending = $qry->fetch();

    error_log(print_r($pending, true));

    if ($pending && $pending["status"] == "accepted") {
        http_response_code(409);
        echo json_encode(["error" => "You're already friends"]);
        exit;
    }
    if ($pending && $pending["status"] == "pending") {
        http_response_code(409);
        echo json_encode(["error" => "A friend request is already pending"]);
        exit;
    }
    if (
        ($pending && $pending["status"] == "rejected") && 
        ($pending["responded_at"] && $pending["responded_at"] >= date("Y-m-d H:i:s", strtotime("-7 days")))) {
        http_response_code(409);
        echo json_encode(["error" => "You cannot send a friend request to this user"]);
        exit;
    }
    if ($pending && $pending["status"] == "blocked") {
        http_response_code(409);
        echo json_encode(["error" => "You cannot send a friend request to this user"]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Add pending request
|--------------------------------------------------------------------------
*/
try {
    $qry = $pdo->prepare("
        INSERT INTO auth_friends (user_id, friend_id, requested_at, responded_at)
        VALUES (:userId, :friendId, NOW(), NULL)
        ON DUPLICATE KEY UPDATE
            status = 'pending',
            requested_at = NOW(),
            responded_at = NULL
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
