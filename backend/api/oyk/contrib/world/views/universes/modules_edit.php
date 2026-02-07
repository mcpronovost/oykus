<?php

header("Content-Type: application/json");

require OYK_PATH . "/core/utils/uploaders.php";
require OYK_PATH . "/core/utils/formatters.php";

global $pdo;
$authUser = require_auth();

$universeService = new UniverseService($pdo);

/*
|--------------------------------------------------------------------------
| Get universe
|--------------------------------------------------------------------------
*/
$universeId = $universeService->getEditableUniverseId($universeSlug, $authUser["id"]);

if (!$universeId) {
  http_response_code(403);
  echo json_encode(["error" => "Universe not found"]);
  exit;
}

/*
|--------------------------------------------------------------------------
| Get POST data
|--------------------------------------------------------------------------
*/

$module = $_POST["module"];
$action = $_POST["action"] === "activate" ? 1 : 0;

/*
|--------------------------------------------------------------------------
| Check allowed module update
|--------------------------------------------------------------------------
*/
$allowedModules = [
  "is_mod_planner_active",
  "is_mod_blog_active",
  "is_mod_forum_active",
  "is_mod_courrier_active",
  "is_mod_collectibles_active",
  "is_mod_achievements_active",
  "is_mod_game_active",
  "is_mod_leveling_active"
];

if (!in_array($module, $allowedModules, TRUE)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid module"]);
  exit;
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
if ($module) {
  $pdo->beginTransaction();
  try {
    $update = $pdo->prepare("
      UPDATE world_universes
      SET $module = $action
      WHERE id = ? AND is_active = 1
    ");
    $update->execute([$universeId]);

    $qry = $pdo->prepare("
      SELECT $module
      FROM world_universes
      WHERE id = ? AND is_active = 1
    ");
    $qry->execute([$universeId]);
    $module = $qry->fetch();

    $pdo->commit();
  }
  catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage(), "code" => $e->getCode()]);
    exit;
  }
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
echo json_encode([
  "ok" => TRUE,
  "module" => $module
]);
