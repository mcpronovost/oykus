<?php

global $pdo;
$authUser = require_auth(FALSE);

$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);

try {
  $qry = $pdo->prepare("
    SELECT wu.id,
            wu.name,
            wu.slug,
            wu.abbr,
            wu.logo,
            wu.cover,
            wu.is_default,
            wu.visibility,
            CASE
              WHEN ? IS NULL THEN 6
              ELSE COALESCE(wr.role, 5)
            END AS role,
            wu.is_mod_planner_active,
            wu.is_mod_blog_active,
            wu.is_mod_forum_active,
            wu.is_mod_courrier_active,
            wu.is_mod_collectibles_active,
            wu.is_mod_rewards_active,
            wu.is_mod_game_active,
            wu.is_mod_leveling_active,
            wu.created_at,
            wu.updated_at
    FROM world_universes wu
    LEFT JOIN world_roles wr ON wr.universe = wu.id AND wr.user = COALESCE(?, -1)
    WHERE wu.slug = ? AND wu.is_active = 1 AND wu.visibility >= CASE
      WHEN ? IS NULL THEN 6
      ELSE COALESCE(wr.role, 5)
    END
    LIMIT 1;
  ");

  $qry->execute([$authUser["id"], $authUser["id"], $universeSlug, $authUser["id"]]);
  $universe = $qry->fetch();

  if (!$universe) {
    Response::notFound("Universe not found");
  }
}
catch (Exception $e) {
  Response::serverError($e->getMessage());
}

$theme = $themeService->getActiveTheme($universe["id"]);

Response::json([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
