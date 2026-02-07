<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

$themeService = new ThemeService($pdo);

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
        FROM world_universes gu
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
}
catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
  exit;
}

$theme = $themeService->getActiveTheme($universe["id"]);

unset($universe["id"]);

echo json_encode([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
