<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current universe
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id, name, owner
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
| Get theme data
|--------------------------------------------------------------------------
*/
try {
    $qry = $pdo->prepare("
        SELECT t.c_primary, t.c_primary_fg, t.variables
        FROM world_themes t
        JOIN world_universes u ON u.id = t.universe
        WHERE u.slug = ? AND
              t.is_active = 1
        LIMIT 1;
    ");

    $qry->execute([$universeSlug]);
    $theme = $qry->fetch();

    if (!$theme) {
        $qry = $pdo->prepare("
            INSERT INTO world_themes (universe, name, c_primary, c_primary_fg, variables, is_active)
            VALUES (?, ?, '#3DA5CB', '#FFFFFF', '{}', 1);
        ");

        $qry->execute([$universe["id"], $universe["name"]]);

        $themeId = $pdo->lastInsertId();

        $qry = $pdo->prepare("
            SELECT *
            FROM world_themes
            WHERE id = ?
            LIMIT 1
        ");
        $qry->execute([$themeId]);
        $theme = $qry->fetch();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Return resource
|--------------------------------------------------------------------------
*/

if ($theme) {
    $theme["variables"] = json_decode($theme["variables"]);
}

echo json_encode([
    "ok" => true,
    "theme" => $theme
]);
