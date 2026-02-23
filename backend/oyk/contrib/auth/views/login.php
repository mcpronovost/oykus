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
    SELECT id, username, password, failedlogin_count, lastlogin_ip
    FROM auth_users
    WHERE username = ? AND is_active = 1
    LIMIT 1
  ");
  $stmt->execute([$username]);
  $authUser = $stmt->fetch();
}
catch (Exception $e) {
  Response::serverError($e->getMessage());
}

$authService->handleFailedLogin($authUser, $password);
$authService->handleSuccessLogin($authUser);

$user = $userService->getCurrentUser($authUser["id"]);

// Access token (15 min)
$accessToken = $authService->getRat($authUser["id"], $authUser["username"], $isProd);

// EventBus::dispatch("user.login", ["user_id" => $user["id"]]);

Response::json([
  "ok" => TRUE,
  "user" => $user,
  "rat" => $accessToken
]);
