<?php

require OYK . "/core/utils/uploaders.php";
require OYK . "/core/utils/formatters.php";

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
  SELECT id, name, slug, is_slug_auto, abbr, is_abbr_auto, avatar, cover, is_dev, timezone
  FROM auth_users
  WHERE id = ?
  LIMIT 1
");
$qry->execute([$authUser["id"]]);
$user = $qry->fetch();

if (!$user) {
  Response::notFound("User not found");
}

if (!$user["is_dev"]) {
  unset($user["is_dev"]);
}

/*
|--------------------------------------------------------------------------
| Collect PATCH data
|--------------------------------------------------------------------------
*/
$patch = [];
$params = ["id" => $user["id"]];

$nameChanged = FALSE;

/* ---------- Name ---------- */
if (isset($_POST["name"]) && $_POST["name"] !== $user["name"]) {
  $patch["name"] = $_POST["name"];
  $params["name"] = $_POST["name"];
  $nameChanged = TRUE;
}

/* ---------- Avatar ---------- */
if (!empty($_FILES["avatar"])) {
  $newAvatar = oyk_save_image(
    $_FILES["avatar"],
    200,
    200,
    "a/u/avatars",
    $user["slug"],
    2
  );

  $patch["avatar"] = $newAvatar;
  $params["avatar"] = $newAvatar;
}

/* ---------- Cover ---------- */
if (!empty($_FILES["cover"])) {
  $newCover = oyk_save_image(
    $_FILES["cover"],
    1136,
    256,
    "a/u/covers",
    $user["slug"],
    2
  );

  $patch["cover"] = $newCover;
  $params["cover"] = $newCover;
}

/*
|--------------------------------------------------------------------------
| Auto fields (depend on name change)
|--------------------------------------------------------------------------
*/
if ($nameChanged && $user["is_slug_auto"]) {
  $patch["slug"] = get_slug($pdo, $params["name"], "auth_users");
  $params["slug"] = $patch["slug"];
}

if ($nameChanged && $user["is_abbr_auto"]) {
  $patch["abbr"] = get_abbr($params["name"], 3);
  $params["abbr"] = $patch["abbr"];
}

/*
|--------------------------------------------------------------------------
| Nothing to update → OK
|--------------------------------------------------------------------------
*/
if (!$patch) {
  unset($user["is_slug_auto"], $user["is_abbr_auto"]);
  Response::json(["ok" => TRUE, "user" => $user]);
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
    UPDATE auth_users
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
| Cleanup old files AFTER commit
|--------------------------------------------------------------------------
*/
if (isset($patch["avatar"]) && $user["avatar"]) {
  $path = OYK . "/../.." . $user["avatar"];
  if (is_file($path)) {
    unlink($path);
  }
}

if (isset($patch["cover"]) && $user["cover"]) {
  $path = OYK . "/../.." . $user["cover"];
  if (is_file($path)) {
    unlink($path);
  }
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
$user = array_merge($user, $patch);
unset($user["is_slug_auto"], $user["is_abbr_auto"]);

Response::json([
  "ok" => TRUE,
  "user" => $user
]);
