<?php

require_once __DIR__ . "/utils/jwt.php";

function require_auth($is_continue=false) {
    $headers = getallheaders();
    $authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? "";

    if (!str_starts_with($authHeader, "Oyk ")) {
        if ($is_continue) return null;
        http_response_code(401);
        echo json_encode(["error" => 401]);
        exit;
    }

    $token = substr($authHeader, 4);
    $payload = decode_jwt($token);

    if (!$payload) {
        if ($is_continue) return null;
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized (p)"]);
        exit;
    }

    return $payload;
}

function update_wio() {
    global $pdo;
    $user = require_auth(true);

    try {
        if ($user) {
            $stmt = $pdo->prepare("
                INSERT INTO auth_wio (user_id, lastlive_at)
                VALUES (:uid, NOW())
                ON DUPLICATE KEY UPDATE lastlive_at = NOW()
            ");
            $stmt->execute(["uid" => $user["id"]]);
        } else {
            $guest = get_guest_id();
            $agent = substr($_SERVER["HTTP_USER_AGENT"] ?? "", 0, 255);

            $stmt = $pdo->prepare("
                INSERT INTO auth_wio (guest_id, agent, lastlive_at)
                VALUES (:gid, :agent, NOW())
                ON DUPLICATE KEY UPDATE lastlive_at = NOW()
            ");
            $stmt->execute(["gid" => $guest, "agent" => $agent]);
        }
    } catch (Exception) {
        return;
    }
}

