<?php

require_once OYK . "/core/utils/uploaders.php";
require_once OYK . "/core/utils/formatters.php";

global $pdo;
$authUserId = require_rat();

$titleService = new TitleService($pdo);

/*
|--------------------------------------------------------------------------
| Load current user
|--------------------------------------------------------------------------
*/
try {
  $qry = $pdo->prepare("
    SELECT u.id,
          u.name,
          u.slug,
          u.is_slug_auto,
          u.abbr,
          u.is_abbr_auto,
          u.avatar,
          u.cover,
          u.is_dev,
          u.timezone,
          u.meta_bio,
          u.meta_birthday,
          u.meta_country,
          u.meta_job,
          u.meta_mood,
          u.meta_website,
          rt.id AS title_id,
          rt.name AS title
    FROM auth_users u
    LEFT JOIN progress_titles_users rut ON rut.user_id = u.id AND rut.is_active = 1
    LEFT JOIN progress_titles rt ON rt.id = rut.title_id
    WHERE u.id = ?
    LIMIT 1
  ");
  $qry->execute([$authUserId]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  throw new QueryException($e->getMessage());
}

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
    "a/u/a",
    $user["id"],
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
    "a/u/c",
    $user["id"],
    2
  );

  $patch["cover"] = $newCover;
  $params["cover"] = $newCover;
}

/* ---------- Title ---------- */
$changeTitleId = NULL;
if (isset($_POST["title"]) && (int) $_POST["title"] !== (int) $user["title_id"]) {
  $changeTitleId = (int) $_POST["title"];
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
if (!$patch && !is_int($changeTitleId)) {
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
  if ($patch) {
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
  }

  if (is_int($changeTitleId)) {
    $pdo->prepare(
      "UPDATE progress_titles_users SET is_active = 0 WHERE user_id = :id AND title_id != :title_id"
    )->execute([$authUserId, $changeTitleId]);

    if ($changeTitleId > 0) {
      $pdo->prepare(
        "UPDATE progress_titles_users SET is_active = 1 WHERE user_id = :id AND title_id = :title_id"
      )->execute([$authUserId, $changeTitleId]);
    }
  }

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
  $path = OYK . "/.." . $user["avatar"];
  if (is_file($path)) {
    unlink($path);
  }
}

if (isset($patch["cover"]) && $user["cover"]) {
  $path = OYK . "/.." . $user["cover"];
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

if (is_int($changeTitleId)) {
  $title = $titleService->getUserActiveTitle($authUserId);
  $user["title"] = $title ? $title["name"] : NULL;
}

Response::json([
  "ok" => TRUE,
  "user" => $user
]);
