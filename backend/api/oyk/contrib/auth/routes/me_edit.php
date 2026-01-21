<?php

header("Content-Type: application/json");

require OYK_PATH."/core/middlewares.php";
require OYK_PATH."/core/db.php";
require OYK_PATH."/core/utils/uploaders.php";
require OYK_PATH."/core/utils/formatters.php";

$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT name, slug, is_slug_auto, abbr, is_abbr_auto, avatar, cover
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
$new_slug       = $user["slug"];
$new_abbr       = $user["abbr"];

if ($new_avatar) {
    $new_avatar = oyk_save_image($new_avatar, 200, 200, "avatars", $user["slug"], 2);
}

if ($new_cover) {
    $new_cover = oyk_save_image($new_cover, 1136, 256, "covers", $user["slug"], 2);
}

if ($user["is_slug_auto"] && $new_name !== $user["name"]) {
    $new_slug = get_slug($pdo, $new_name, "users");
}

if ($user["is_abbr_auto"] && $new_name !== $user["name"]) {
    $new_abbr = get_abbr($new_name, 3);
}

try {
    $qry = $pdo->prepare("
        UPDATE users
        SET name=:name, avatar=:avatar, cover=:cover, slug=:slug, abbr=:abbr
        WHERE id=:id
    ");
    $qry->execute([
        "name" => $new_name,
        "avatar" => $new_avatar ?? $user["avatar"],
        "cover" => $new_cover ?? $user["cover"],
        "slug" => $new_slug ?? $user["slug"],
        "abbr" => $new_abbr ?? $user["abbr"],
        "id" => $authUser["id"]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

if ($user["avatar"] && $new_avatar) {
    unlink(OYK_PATH."/../..".$user["avatar"]);
}

if ($user["cover"] && $new_cover) {
    unlink(OYK_PATH."/../..".$user["cover"]);
}

$user["name"] = $new_name;
$user["avatar"] = $new_avatar ?? $user["avatar"];
$user["cover"] = $new_cover ?? $user["cover"];
$user["slug"] = $new_slug ?? $user["slug"];
$user["abbr"] = $new_abbr ?? $user["abbr"];

echo json_encode([
    "ok" => true,
    "user" => $user
]);
