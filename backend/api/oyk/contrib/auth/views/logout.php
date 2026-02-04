<?php

header("Content-Type: application/json");

global $pdo;

$isProd = getenv("HTTP_ISPROD");
$authUser = require_auth(true);

setcookie(
    "oyk-rat",
    "",
    [
        "expires"  => time() - 3600,
        "path"     => "/",
        "secure"   => $isProd,
        "httponly" => true,
        "samesite" => $isProd ? "Lax" : "None",
    ]
);

try {
    $qry = $pdo->prepare("
        DELETE FROM auth_wio
        WHERE user_id = :id
    ");

    $qry->execute(["id" => $authUser["id"]]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

echo json_encode([
    "ok" => true
]);
