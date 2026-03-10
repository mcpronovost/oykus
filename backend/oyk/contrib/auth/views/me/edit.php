<?php

require OYK . "/core/utils/uploaders.php";
require OYK . "/core/utils/formatters.php";

global $pdo;
$userId = require_rat();

/*
|--------------------------------------------------------------------------
| Load current user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
  SELECT id,
         name,
         slug,
         is_slug_auto,
         abbr, is_abbr_auto,
         avatar,
         cover,
         is_dev,
         timezone,
         meta_bio,
         meta_birthday,
         meta_country,
         meta_job,
         meta_mood,
         meta_website
  FROM auth_users
  WHERE id = ?
  LIMIT 1
");
$qry->execute([$userId]);
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

/* ---------- Meta Bio ---------- */
if (isset($_POST["meta_bio"]) && $_POST["meta_bio"] !== $user["meta_bio"]) {
  $patch["meta_bio"] = $_POST["meta_bio"];
  $params["meta_bio"] = $_POST["meta_bio"];
}

/* ---------- Meta Birthday ---------- */
if (isset($_POST["meta_birthday"]) && $_POST["meta_birthday"] !== $user["meta_birthday"]) {
  $value = trim($_POST["meta_birthday"]);
  if ($value === "") {
    $patch["meta_birthday"] = NULL;
    $params["meta_birthday"] = NULL;
  }
  else {
    $patch["meta_birthday"] = $value;
    $params["meta_birthday"] = $value;
  }
}

/* ---------- Meta Country ---------- */
if (isset($_POST["meta_country"]) && $_POST["meta_country"] !== $user["meta_country"]) {
  $patch["meta_country"] = strip_tags(trim($_POST["meta_country"]));
  $params["meta_country"] = strip_tags(trim($_POST["meta_country"]));
}

/* ---------- Meta Job ---------- */
if (isset($_POST["meta_job"]) && $_POST["meta_job"] !== $user["meta_job"]) {
  $patch["meta_job"] = strip_tags(trim($_POST["meta_job"]));
  $params["meta_job"] = strip_tags(trim($_POST["meta_job"]));
}

/* ---------- Meta Mood ---------- */
if (isset($_POST["meta_mood"]) && $_POST["meta_mood"] !== $user["meta_mood"]) {
  $patch["meta_mood"] = strip_tags(trim($_POST["meta_mood"]));
  $params["meta_mood"] = strip_tags(trim($_POST["meta_mood"]));
}

/* ---------- Meta Website ---------- */
if (isset($_POST["meta_website"]) && $_POST["meta_website"] !== $user["meta_website"]) {
  $raw = trim($_POST["meta_website"]);
  $clean = strip_tags($raw);

  // If no scheme is provided, add https:// before validating
  if (!preg_match('~^https?://~i', $clean)) {
    $clean = "https://" . $clean;
  }

  if (filter_var($clean, FILTER_VALIDATE_URL) && str_starts_with($clean, "https://")) {
    $patch["meta_website"] = $clean;
    $params["meta_website"] = $clean;
  }
}

/* ---------- Meta Social Media ---------- */
if (isset($_POST["meta_socials"])) {
  $socials = json_decode($_POST["meta_socials"], TRUE);

  if (!is_array($socials)) {
    $socials = [];
  }

  $cleanSocials = [];

  foreach ($socials as $platform => $url) {
    $url = trim(strip_tags($url));
    if ($url === "") {
      continue;
    }
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
      return Response::badRequest("Invalid URL", ["fields" => ["{$platform}" => "Invalid URL"]]);
    }
    $cleanSocials[$platform] = $url;
  }
  $json = json_encode($cleanSocials, JSON_UNESCAPED_SLASHES);

  $patch["meta_socials"] = $json;
  $params["meta_socials"] = $json;
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
  Response::serverError($e->getMessage());
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
