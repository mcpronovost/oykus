<?php

header("Content-Type: application/json");

require OYK_PATH . "/core/utils/formatters.php";
require OYK_PATH . "/core/utils/uploaders.php";
require OYK_PATH . "/core/utils/validaters.php";

global $pdo;
$authUser = require_auth();

$themeService = new ThemeService($pdo);

/*
|--------------------------------------------------------------------------
| Load current universe
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id, slug, logo, cover, owner
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
| Load current universe
|--------------------------------------------------------------------------
*/
$theme = $themeService->getActiveTheme($universe["id"]);

if (!$theme) {
  http_response_code(404);
  echo json_encode(["error" => "Theme not found"]);
  exit;
}

/*
|--------------------------------------------------------------------------
| Collect universe PATCH data
|--------------------------------------------------------------------------
*/
$patch = [];
$params = ["id" => $universe["id"]];

/* ---------- Avatar ---------- */
if (!empty($_FILES["logo"])) {
  $newLogo = oyk_save_image(
    $_FILES["logo"],
    200,
    200,
    "w/u/logos",
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
    "w/u/covers",
    $universe["slug"],
    2
  );

  $patch["cover"] = $newCover;
  $params["cover"] = $newCover;
}

/*
|--------------------------------------------------------------------------
| Collect theme PATCH data
|--------------------------------------------------------------------------
*/
$patchTheme = [];
$paramsTheme = ["id" => $theme["id"]];

/* ---------- c_primary ---------- */
if (isset($_POST["c_primary"]) && $_POST["c_primary"] !== $theme["c_primary"]) {
  if ($_POST["c_primary"] === "") {
    $_POST["c_primary"] = "#3DA5CB";
  }
  else if (!is_string($_POST["c_primary"]) || !isHexColor($_POST["c_primary"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid colour value for 'c_primary'", "code" => "400"]);
    exit;
  }

  $patchTheme["c_primary"] = $_POST["c_primary"];
  $paramsTheme["c_primary"] = $_POST["c_primary"];
}

/* ---------- c_primary_fg ---------- */
if (isset($_POST["c_primary_fg"]) && $_POST["c_primary_fg"] !== $theme["c_primary_fg"]) {
  if ($_POST["c_primary_fg"] === "") {
    $_POST["c_primary_fg"] = "#FFFFFF";
  }
  else if (!is_string($_POST["c_primary_fg"]) || !isHexColor($_POST["c_primary_fg"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid colour value for 'c_primary_fg'", "code" => "400"]);
    exit;
  }

  $patchTheme["c_primary_fg"] = $_POST["c_primary_fg"];
  $paramsTheme["c_primary_fg"] = $_POST["c_primary_fg"];
}

/* ---------- variables ---------- */
if (isset($_POST["variables"]) && $_POST["variables"] !== $theme["variables"]) {
  $decoded_json = json_decode($_POST["variables"], TRUE);
  foreach ($decoded_json as $key => $value) {
    if ($value === "") {
      unset($decoded_json[$key]);
      continue;
    }
    if ($key === "radius") {
      if ((int) $value < 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid value for '$key'", "code" => "400"]);
        exit;
      }
      else {
        $decoded_json[$key] = $value . "px";
        continue;
      }
    }
    else if (!is_string($value) || !isHexColor($value)) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid colour value for '$key'", "code" => "400"]);
      exit;
    }
  }

  $patchTheme["variables"] = json_encode($decoded_json);
  $paramsTheme["variables"] = json_encode($decoded_json);
}

/*
|--------------------------------------------------------------------------
| Persist PATCH (transaction-safe)
|--------------------------------------------------------------------------
*/
$pdo->beginTransaction();

try {
  if ($patch) {
    $sets = [];
    foreach ($patch as $field => $_) {
      $sets[] = "$field = :$field";
    }

    $sql = "
            UPDATE world_universes
            SET " . implode(", ", $sets) . "
            WHERE id = :id
        ";

    $pdo->prepare($sql)->execute($params);
  }

  if ($patchTheme) {
    $sets = [];
    foreach ($patchTheme as $field => $_) {
      $sets[] = "$field = :$field";
    }

    $sql = "
            UPDATE world_themes
            SET " . implode(", ", $sets) . "
            WHERE id = :id
        ";

    $pdo->prepare($sql)->execute($paramsTheme);
  }

  $pdo->commit();
}
catch (Exception $e) {
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
  $path = OYK_PATH . "/../.." . $universe["logo"];
  if (is_file($path)) {
    unlink($path);
  }
}

if (isset($patch["cover"]) && $universe["cover"]) {
  $path = OYK_PATH . "/../.." . $universe["cover"];
  if (is_file($path)) {
    unlink($path);
  }
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
unset($universe["id"], $universe["owner"]);
$universe = array_merge($universe, $patch);
unset($theme["id"]);
$theme = array_merge($theme, $patchTheme);

if ($theme) {
  $theme["variables"] = json_decode($theme["variables"]);
}

echo json_encode([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
