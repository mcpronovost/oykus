<?php

require OYK . "/core/utils/formatters.php";
require OYK . "/core/utils/uploaders.php";
require OYK . "/core/utils/validaters.php";

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
  Response::notFound("Universe not found");
}

/*
|--------------------------------------------------------------------------
| Check edit permission
|--------------------------------------------------------------------------
*/
if ($universe["owner"] !== $authUser["id"]) {
  Response::forbidden();
}

/*
|--------------------------------------------------------------------------
| Load current universe
|--------------------------------------------------------------------------
*/
$theme = $themeService->getActiveTheme($universe["id"]);

if (!$theme) {
  Response::notFound("Theme not found");
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
    Response::badRequest("Invalid colour value for 'c_primary'");
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
    Response::badRequest("Invalid colour value for 'c_primary_fg'");
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
        Response::badRequest("Invalid value for 'radius'");
      }
      else {
        $decoded_json[$key] = $value . "px";
        continue;
      }
    }
    else if (!is_string($value) || !isHexColor($value)) {
      Response::badRequest("Invalid colour value for '{$key}'");
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
  Response::serverError();
}

/*
|--------------------------------------------------------------------------
| Cleanup old files AFTER commit
|--------------------------------------------------------------------------
*/
if (isset($patch["logo"]) && $universe["logo"]) {
  $path = OYK . "/../.." . $universe["logo"];
  if (is_file($path)) {
    unlink($path);
  }
}

if (isset($patch["cover"]) && $universe["cover"]) {
  $path = OYK . "/../.." . $universe["cover"];
  if (is_file($path)) {
    unlink($path);
  }
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
unset($universe["owner"]);
$universe = array_merge($universe, $patch);
$theme = array_merge($theme, $patchTheme);

if ($theme) {
  $theme["variables"] = json_decode($theme["variables"]);
}

Response::json([
  "ok" => TRUE,
  "universe" => $universe,
  "theme" => $theme
]);
