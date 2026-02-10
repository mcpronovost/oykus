<?php

global $pdo;

$isProd = getenv("HTTP_ISPROD");
$data = json_decode(file_get_contents("php://input"), TRUE);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
  Response::badRequest("Invalid data");
}

try {
  $stmt = $pdo->prepare("
    SELECT id, username, password, name, slug, abbr, avatar, cover, is_dev
    FROM auth_users
    WHERE username = ?
    LIMIT 1
  ");
  $stmt->execute([$username]);
  $user = $stmt->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$user || !password_verify($password, $user["password"])) {
  Response::badRequest("Invalid data");
}

// Access token (15 min)
$accessToken = generate_jwt([
  "id" => $user["id"],
  "username" => $user["username"],
  "exp" => time() + 900
]);

// Refresh token (30 days)
$refreshToken = generate_jwt([
  "id" => $user["id"],
  "username" => $user["username"],
  "jti" => bin2hex(random_bytes(16)),
  "exp" => time() + 60 * 60 * 24 * 30
]);

setcookie(
  "oyk-rat",
  $refreshToken,
  [
    "expires" => time() + 60 * 60 * 24 * 30,
    "path" => "/",
    "secure" => $isProd,
    "httponly" => TRUE,
    "samesite" => $isProd ? "Lax" : "None",
  ]
);

// EventBus::dispatch("user.login", ["user_id" => $user["id"]]);

unset($user["username"], $user["password"]);

Response::json([
  "ok" => TRUE,
  "user" => $user,
  "rat" => $accessToken
]);
