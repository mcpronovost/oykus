<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        SELECT gu.name, gu.slug, gu.abbr, gu.c_primary, gu.c_primary_fg
        FROM game_universes gu
        WHERE gu.is_public = 1 OR gu.owner = :owner
        ORDER BY gu.name ASC;
    ");

    $qry->execute(["id" => $authUser["id"]]);
    $universes = $qry->fetchAll();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

echo json_encode([
    "ok"        => true,
    "universes" => $universes
]);
