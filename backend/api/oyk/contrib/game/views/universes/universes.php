<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT gu.name,
               gu.slug,
               gu.abbr,
               gu.logo,
               gu.cover,
               gu.c_primary,
               gu.c_primary_fg
        FROM game_universes gu
        WHERE gu.is_public = 1 OR
              gu.owner = ?
        ORDER BY gu.is_default DESC,
                (gu.owner = ?) DESC,
                 gu.name ASC;
    ");

    $qry->execute([$authUser["id"], $authUser["id"]]);
    $universes = $qry->fetchAll();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

echo json_encode([
    "ok"        => true,
    "universes" => $universes
]);
