<?php

header("Content-Type: application/json");

require OYK_PATH."/core/middlewares.php";
require OYK_PATH."/core/db.php";
require OYK_PATH."/core/utils/uploaders.php";

$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT name, slug, abbr, avatar, cover
        FROM users
        WHERE id = :id
        LIMIT 1
    ");
    $qry->execute(["id" => $authUser["id"]]);
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

$new_name       = $_POST["name"] ?? $user["name"];
$new_avatar     = $_FILES["avatar"] ?? null;
$new_cover      = $_FILES["cover"] ?? null;

if ($new_avatar) {
    $new_avatar = oyk_save_image($new_avatar, 200, 200, "avatars", 2);
}

if ($new_cover) {
    $new_cover = oyk_save_image($new_cover, 1136, 256, "covers", 2);
}

try {
    $qry = $pdo->prepare("
        UPDATE users
        SET name=:name, avatar=:avatar, cover=:cover
        WHERE id=:id
    ");
    $qry->execute([
        "name" => $new_name,
        "avatar" => $new_avatar ?? $user["avatar"],
        "cover" => $new_cover ?? $user["cover"],
        "id" => $authUser["id"]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

$user["name"] = $new_name;
$user["avatar"] = $new_avatar ?? $user["avatar"];
$user["cover"] = $new_cover ?? $user["cover"];

echo json_encode([
    "ok" => true,
    "user" => $user
]);
