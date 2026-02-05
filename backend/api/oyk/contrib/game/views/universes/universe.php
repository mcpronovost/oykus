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
               gu.visibility,
               gu.is_mod_planner_active,
               gu.is_mod_blog_active,
               gu.is_mod_forum_active,
               gu.is_mod_courrier_active,
               gu.is_mod_collectibles_active,
               gu.is_mod_achievements_active,
               gu.is_mod_game_active,
               gu.is_mod_leveling_active,
               gu.created_at,
               gu.updated_at
        FROM game_universes gu
        WHERE gu.slug = ? AND 
             (gu.visibility = 4 OR gu.owner = ?) AND
             gu.is_active = 1
        LIMIT 1;
    ");

    $qry->execute([$universeSlug, $authUser["id"]]);
    $universe = $qry->fetch();

    if (!$universe) {
        http_response_code(404);
        echo json_encode(["error" => "Universe not found"]);
        exit;
    }

    $qry = $pdo->prepare("
        SELECT c_primary, c_primary_fg, stylesheet
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

if ($theme) {
    $theme["stylesheet"] = json_decode($theme["stylesheet"]);
}

echo json_encode([
    "ok"        => true,
    "universe"  => $universe,
    "theme"     => $theme
]);
