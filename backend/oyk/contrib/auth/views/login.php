<?php

global $pdo;

$authService = new AuthService($pdo);
$userService = new UserService($pdo);

$fields = $authService->validateData($_POST);

$authUser = $authService->getLoginUser($fields["username"]);

$authService->handleFailedLogin($authUser, $fields["password"]);
$authService->handleSuccessLogin($authUser);

$user = $userService->getCurrentUser($authUser["id"]);

// Access token (15 min)
$accessToken = $authService->getRat($authUser["id"], TRUE);

// EventBus::dispatch("user.login", ["user_id" => $user["id"]]);

Response::json([
  "ok" => TRUE,
  "user" => $user,
  "rat" => $accessToken
]);
