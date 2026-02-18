<?php
header("Content-Type: text/css");

// Prevent caching
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

global $pdo;

$universeSlug = $_COOKIE["oyk-world"] ?? null;

if (!$universeSlug) {
    Response::notFound();
}

try {
    $qry = $pdo->prepare("
        SELECT t.c_primary, t.c_primary_fg, t.variables
        FROM world_themes t
        JOIN world_universes u ON u.id = t.universe
        WHERE u.slug = ? AND
              t.is_active = 1
        LIMIT 1;
    ");

    $qry->execute([$universeSlug]);
    $theme = $qry->fetch() ?: null;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

if ($theme) {
    $theme["variables"] = json_decode($theme["variables"], TRUE);

    echo ":root {\n";
    echo "--oyk-c-primary: ".$theme['c_primary'].";\n";
    echo "--oyk-c-primary-fg: ".$theme['c_primary_fg'].";\n";

    foreach ($theme["variables"] as $k => $v) {
      echo "--oyk-$k: $v;\n";
    }
    echo "}\n";
    exit;
}

Response::notFound();