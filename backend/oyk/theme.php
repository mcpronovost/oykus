<?php
header("Content-Type: text/css");

// Prevent caching
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

global $pdo;

$universeSlug = $_COOKIE["oyk-world"] ?? NULL;

if (!$universeSlug) {
  Response::noContent();
}

try {
  $qry = $pdo->prepare("
    SELECT t.c_primary, t.c_primary_fg, t.variables
    FROM world_themes t
    JOIN world_universes u ON u.id = t.universe_id
    WHERE u.slug = ? AND
          t.is_active = 1
    LIMIT 1;
  ");

  $qry->execute([$universeSlug]);
  $theme = $qry->fetch() ?: NULL;
}
catch (Exception $e) {
  Response::serverError($e->getMessage());
}

if ($theme) {
  $theme["variables"] = json_decode($theme["variables"], TRUE);

  echo ":root {\n";
  echo "--oyk-c-primary: " . $theme['c_primary'] . ";\n";
  echo "--oyk-c-primary-fg: " . $theme['c_primary_fg'] . ";\n";

  foreach ($theme["variables"] as $k => $v) {
    echo "--oyk-$k: $v;\n";
  }
  echo "}\n";
  exit;
}

Response::noContent();
