<?php
header("Content-Type: text/css");

global $pdo;

$universeSlug = $_COOKIE["oyk-theme"] ?? null;

if (!$universeSlug) {
    http_response_code(404);
    exit;
}

try {
    $qry = $pdo->prepare("
        SELECT t.c_primary, t.c_primary_fg, t.stylesheet
        FROM game_themes t
        JOIN game_universes u ON u.id = t.universe
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
    $theme["stylesheet"] = json_decode($theme["stylesheet"]);

    echo ":root {\n";
    echo "--oyk-c-primary: ".$theme['c_primary'].";\n";
    echo "--oyk-c-primary-fg: ".$theme['c_primary_fg'].";\n";

    foreach ($theme["stylesheet"] as $k => $v) {
      echo "--$k: $v;\n";
    }
    echo "}\n";
    exit;
}

http_response_code(404);
exit;
