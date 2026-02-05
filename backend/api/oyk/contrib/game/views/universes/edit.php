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
    SELECT id, name, slug, is_slug_auto, abbr, is_abbr_auto, logo, cover
    FROM game_universes
    WHERE slug = ? and owner = ?
    LIMIT 1
");
$qry->execute([$universeSlug, $authUser["id"]]);
$universe = $qry->fetch();

if (!$universe) {
    http_response_code(404);
    echo json_encode(["error" => "Universe not found"]);
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

/* ---------- Avatar ---------- */
if (!empty($_FILES["logo"])) {
    $newLogo = oyk_save_image(
        $_FILES["logo"],
        200,
        200,
        "logos",
        $universe["slug"],
        2
    );

    $patch["logo"] = $newLogo;
    $params["logo"] = $newLogo;
}

/* ---------- Cover ---------- */
if (!empty($_FILES["cover"])) {
    $newCover = oyk_save_image(
        $_FILES["cover"],
        1136,
        256,
        "covers",
        $universe["slug"],
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
if ($nameChanged && $universe["is_slug_auto"]) {
    $patch["slug"] = get_slug($pdo, $params["name"], "game_universes");
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
        UPDATE game_universes
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
