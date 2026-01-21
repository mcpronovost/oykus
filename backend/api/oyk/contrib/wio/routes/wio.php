<?php

header("Content-Type: application/json");

global $pdo;

try {
    $qry = $pdo->prepare("
        SELECT 
            u.name,
            u.slug,
            u.abbr,
            u.avatar
        FROM wio w
        LEFT JOIN users u ON w.user_id = u.id
        WHERE w.lastlive_at > NOW() - INTERVAL 5 MINUTE
            AND w.user_id IS NOT NULL
        ORDER BY w.lastlive_at DESC
    ");
    $qry->execute();
    $users = $qry->fetchAll();

    $guests = (int) $pdo->query("
        SELECT COUNT(*) FROM wio
        WHERE lastlive_at > NOW() - INTERVAL 5 MINUTE
        AND user_id IS NULL
    ")->fetchColumn();

    echo json_encode([
        "ok"        => true,
        "users"     => $users,
        "guests"    => $guests
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}