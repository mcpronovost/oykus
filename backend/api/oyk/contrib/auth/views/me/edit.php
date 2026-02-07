<?php

header("Content-Type: application/json");

require OYK_PATH."/core/utils/uploaders.php";
require OYK_PATH."/core/utils/formatters.php";

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id, name, slug, is_slug_auto, abbr, is_abbr_auto, avatar, cover
    FROM auth_users
    WHERE id = :id
    LIMIT 1
");
$qry->execute(["id" => $authUser["id"]]);
$user = $qry->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Collect PATCH data
|--------------------------------------------------------------------------
*/
$patch = [];
$params = ["id" => $user["id"]];

$nameChanged = false;

/* ---------- Name ---------- */
if (isset($_POST["name"]) && $_POST["name"] !== $user["name"]) {
    $patch["name"] = $_POST["name"];
    $params["name"] = $_POST["name"];
    $nameChanged = true;
}

/* ---------- Avatar ---------- */
if (!empty($_FILES["avatar"])) {
    $newAvatar = oyk_save_image(
        $_FILES["avatar"],
        200,
        200,
        "a/u/avatars",
        $user["slug"],
        2
    );

    $patch["avatar"] = $newAvatar;
    $params["avatar"] = $newAvatar;
}

/* ---------- Cover ---------- */
if (!empty($_FILES["cover"])) {
    $newCover = oyk_save_image(
        $_FILES["cover"],
        1136,
        256,
        "a/u/covers",
        $user["slug"],
        2
    );

    $patch["cover"] = $newCover;
    $params["cover"] = $newCover;
}

/*
|--------------------------------------------------------------------------
| Auto fields (depend on name change)
|--------------------------------------------------------------------------
*/
if ($nameChanged && $user["is_slug_auto"]) {
    $patch["slug"] = get_slug($pdo, $params["name"], "auth_users");
    $params["slug"] = $patch["slug"];
}

if ($nameChanged && $user["is_abbr_auto"]) {
    $patch["abbr"] = get_abbr($params["name"], 3);
    $params["abbr"] = $patch["abbr"];
}

/*
|--------------------------------------------------------------------------
| Nothing to update → OK
|--------------------------------------------------------------------------
*/
if (!$patch) {
    unset($user["id"], $user["is_slug_auto"], $user["is_abbr_auto"]);
    echo json_encode(["ok" => true, "user" => $user]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Persist PATCH (transaction-safe)
|--------------------------------------------------------------------------
*/
$pdo->beginTransaction();

try {
    $sets = [];
    foreach ($patch as $field => $_) {
        $sets[] = "$field = :$field";
    }

    $sql = "
        UPDATE auth_users
        SET ".implode(", ", $sets)."
        WHERE id = :id
    ";

    $pdo->prepare($sql)->execute($params);
    $pdo->commit();

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage(), "code" => $e->getCode()]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Cleanup old files AFTER commit
|--------------------------------------------------------------------------
*/
if (isset($patch["avatar"]) && $user["avatar"]) {
    $path = OYK_PATH."/../..".$user["avatar"];
    if (is_file($path)) {
        unlink($path);
    }
}

if (isset($patch["cover"]) && $user["cover"]) {
    $path = OYK_PATH."/../..".$user["cover"];
    if (is_file($path)) {
        unlink($path);
    }
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
$user = array_merge($user, $patch);
unset($user["id"], $user["is_slug_auto"], $user["is_abbr_auto"]);

echo json_encode([
    "ok" => true,
    "user" => $user
]);
