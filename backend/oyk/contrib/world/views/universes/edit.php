<?php

require OYK . "/core/utils/uploaders.php";
require OYK . "/core/utils/formatters.php";

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current universe
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
  SELECT id, name, slug, is_slug_auto, abbr, is_abbr_auto, owner, visibility, is_default
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
| Collect PATCH data
|--------------------------------------------------------------------------
*/
$patch = [];
$params = ["id" => $universe["id"]];

$nameChanged = FALSE;

/* ---------- Name ---------- */
if (isset($_POST["name"]) && $_POST["name"] !== $universe["name"]) {
  $patch["name"] = $_POST["name"];
  $params["name"] = $_POST["name"];
  $nameChanged = TRUE;
}

/* ---------- Visibility ---------- */
if (isset($_POST["visibility"]) && $_POST["visibility"] !== $universe["visibility"]) {
  if ($universe["is_default"] === 1 && $_POST["visibility"] != 6) {
    Response::forbidden("Default universe need to be public");
  }

  $patch["visibility"] = $_POST["visibility"];
  $params["visibility"] = $_POST["visibility"];
}

/*
|--------------------------------------------------------------------------
| Auto fields (depend on name change)
|--------------------------------------------------------------------------
*/
if ($nameChanged && $universe["is_slug_auto"]) {
  $patch["slug"] = get_slug($pdo, $params["name"], "world_universes");
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
  unset($universe["is_slug_auto"], $universe["is_abbr_auto"]);
  Response::json(["ok" => TRUE, "universe" => $universe]);
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
    UPDATE world_universes
    SET " . implode(", ", $sets) . "
    WHERE id = :id
  ";

  $pdo->prepare($sql)->execute($params);
  $pdo->commit();

}
catch (Exception $e) {
  $pdo->rollBack();
  Response::serverError();
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
$universe = array_merge($universe, $patch);
unset($universe["is_slug_auto"], $universe["is_abbr_auto"]);

Response::json([
  "ok" => TRUE,
  "universe" => $universe
]);
