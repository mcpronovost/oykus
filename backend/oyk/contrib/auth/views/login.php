<?php

global $pdo;

$authService = new AuthService($pdo);
$userService = new UserService($pdo);

$isProd = getenv("HTTP_ISPROD");
$data = json_decode(file_get_contents("php://input"), TRUE);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
  Response::badRequest("Invalid data");
}

try {
  $stmt = $pdo->prepare("
    SELECT id, username, password
    FROM auth_users
    WHERE username = ?
    LIMIT 1
  ");
  $stmt->execute([$username]);
  $user = $stmt->fetch();
}
catch (Exception $e) {
  Response::serverError($e->getMessage());
}

if (!$user || !password_verify($password, $user["password"])) {
  Response::badRequest("Invalid data");
}

// Access token (15 min)
$accessToken = $authService->getRat($user["id"], $user["username"], $isProd);

// EventBus::dispatch("user.login", ["user_id" => $user["id"]]);

$user = $userService->getCurrentUser($user["id"]);

Response::json([
  "ok" => TRUE,
  "user" => $user,
  "rat" => $accessToken
]);
