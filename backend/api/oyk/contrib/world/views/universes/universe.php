<?php

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);
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
            gu.is_mod_rewards_active,
            gu.is_mod_game_active,
            gu.is_mod_leveling_active,
            gu.created_at,
            gu.updated_at
    FROM world_universes gu
    WHERE gu.slug = ? AND 
         ((gu.visibility = 5 OR gu.visibility = 6) OR gu.owner = ?) AND
          gu.is_active = 1
    LIMIT 1;
  ");

  $qry->execute([$universeSlug, $authUser["id"]]);
  $universe = $qry->fetch();

  if (!$universe) {
    Response::notFound("Universe not found");
  }
}
catch (Exception $e) {
  Response::serverError();
}

$theme = $themeService->getActiveTheme($universe["id"]);

$universe["role"] = $universeService->getUserRole($universe["id"], $authUser["id"]);

Response::json([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
