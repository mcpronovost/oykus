<?php

header("Content-Type: application/json");

require OYK_PATH."/contrib/achievements/utils/earn_achievement.php";

global $pdo;

$isProd = getenv("HTTP_ISPROD");
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

try{
    $stmt = $pdo->prepare("
        SELECT id, username, password, name, slug, abbr, avatar, cover, is_dev
        FROM auth_users
        WHERE username = ?
        LIMIT 1
    ");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}

if (!$user || !password_verify($password, $user["password"])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

// Access token (15 min)
$accessToken = generate_jwt([
    "id"        => $user["id"],
    "username"  => $user["username"],
    "exp" => time() + 900
]);

// Refresh token (30 days)
$refreshToken = generate_jwt([
    "id"        => $user["id"],
    "username"  => $user["username"],
    "jti" => bin2hex(random_bytes(16)),
    "exp" => time() + 60 * 60 * 24 * 30
]);

setcookie(
    "oyk-rat",
    $refreshToken,
    [
        "expires"  => time() + 60 * 60 * 24 * 30,
        "path"     => "/",
        "secure"   => $isProd,
        "httponly" => true,
        "samesite" => $isProd ? "Lax" : "None",
    ]
);

earn_achievement($pdo, "first_login", $user["id"]);

unset($user["id"], $user["username"], $user["password"]);

echo json_encode([
    "ok"    => true,
    "user"  => $user,
    "rat"   => $accessToken
]);
