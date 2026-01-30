<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT gu.id,
               gu.name,
               gu.slug,
               gu.abbr,
               gu.logo,
               gu.cover,
               gu.is_default,
               gu.is_public,
               gu.is_mod_planner_active,
               gu.is_mod_forum_active,
               gu.is_mod_collectibles_active,
               gu.is_mod_achievements_active,
               gu.created_at,
               gu.updated_at
        FROM game_universes gu
        WHERE gu.slug = ? AND 
             (gu.is_public = 1 OR gu.owner = ?)
        LIMIT 1;
    ");

    $qry->execute([$universeSlug, $authUser["id"]]);
    $universe = $qry->fetch() ?: null;

    $qry = $pdo->prepare("
        SELECT *
        FROM game_themes
        WHERE universe = ? AND
              is_active = 1
        LIMIT 1;
    ");

    $qry->execute([$universe["id"]]);
    $theme = $qry->fetch() ?: null;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

unset($universe["id"]);
unset($theme["id"], $theme["universe"], $theme["name"], $theme["is_active"]);

echo json_encode([
    "ok"        => true,
    "universe"  => $universe,
    "theme"     => $theme
]);
