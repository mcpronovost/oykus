<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $qry = $pdo->prepare("
        DELETE FROM wio
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
