<?php

header("Content-Type: application/json");

require OYK_PATH."/core/utils/uploaders.php";
require OYK_PATH."/core/utils/formatters.php";

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current universe
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id, name, slug, is_slug_auto, abbr, is_abbr_auto, logo, cover, owner, visibility, is_default
    FROM world_universes
    WHERE slug = ? AND is_active = 1
    LIMIT 1
");
$qry->execute([$universeSlug]);
$universe = $qry->fetch();

if (!$universe) {
    http_response_code(404);
    echo json_encode(["error" => "Universe not found"]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Check edit permission
|--------------------------------------------------------------------------
*/
if ($universe["owner"] !== $authUser["id"]) {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden"]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Collect PATCH data
|--------------------------------------------------------------------------
*/
$patch = [];
$params = ["id" => $universe["id"]];

$nameChanged = false;

/* ---------- Name ---------- */
if (isset($_POST["name"]) && $_POST["name"] !== $universe["name"]) {
    $patch["name"] = $_POST["name"];
    $params["name"] = $_POST["name"];
    $nameChanged = true;
}

/* ---------- Visibility ---------- */
if (isset($_POST["visibility"]) && $_POST["visibility"] !== $universe["visibility"]) {
    if ($universe["is_default"] === 1 && $_POST["visibility"] != 4) {
        http_response_code(403);
        echo json_encode(["error" => "Default universe need to be public"]);
        exit;
    }

    $patch["visibility"] = $_POST["visibility"];
    $params["visibility"] = $_POST["visibility"];
}

/*
|--------------------------------------------------------------------------
| Auto fields (depend on name change)
|--------------------------------------------------------------------------
*/
if ($nameChanged && $universe["is_slug_auto"]) {
    $patch["slug"] = get_slug($pdo, $params["name"], "world_universes");
    $params["slug"] = $patch["slug"];
}

if ($nameChanged && $universe["is_abbr_auto"]) {
    $patch["abbr"] = get_abbr($params["name"], 3);
    $params["abbr"] = $patch["abbr"];
}

/*
|--------------------------------------------------------------------------
| Nothing to update → OK
|--------------------------------------------------------------------------
*/
if (!$patch) {
    unset($universe["id"], $universe["is_slug_auto"], $universe["is_abbr_auto"]);
    echo json_encode(["ok" => true, "universe" => $universe]);
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
        UPDATE world_universes
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
if (isset($patch["logo"]) && $universe["logo"]) {
    $path = OYK_PATH."/../..".$universe["logo"];
    if (is_file($path)) {
        unlink($path);
    }
}

if (isset($patch["cover"]) && $universe["cover"]) {
    $path = OYK_PATH."/../..".$universe["cover"];
    if (is_file($path)) {
        unlink($path);
    }
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
$universe = array_merge($universe, $patch);
unset($universe["is_slug_auto"], $universe["is_abbr_auto"]);

echo json_encode([
    "ok" => true,
    "universe" => $universe
]);
