<?php

require __DIR__ . "/../../../core/utils/formatters.php";

global $pdo;

// Get data
$data = json_decode(file_get_contents("php://input"), TRUE);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";
$email = trim($data["email"] ?? "");
$name = trim($data["name"] ?? "");

// Validations
if (
  $username === "" ||
  $password === "" ||
  $email === "" ||
  $name === "" ||
  !filter_var($email, FILTER_VALIDATE_EMAIL) ||
  strlen($password) < 8
) {
  Response::badRequest("Invalid data");
}

try {
  // Check if username OR email already exists
  $stmt = $pdo->prepare("
    SELECT id FROM auth_users
    WHERE username = ? OR email = ?
    LIMIT 1
  ");
  $stmt->execute([$username, $email]);

  if ($stmt->fetch()) {
    Response::conflict("Username or email already exists");
  }
}
catch (Exception $e) {
  Response::serverError();
}

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$slug = get_slug($pdo, $name, "auth_users");
$abbr = get_abbr($name, 3);

// Create new user
$stmt = $pdo->prepare("
  INSERT INTO auth_users (username, email, name, password, slug, abbr)
  VALUES (:username, :email, :name, :password_hash, :slug, :abbr)
");

$stmt->execute([
  "username" => $username,
  "email" => $email,
  "name" => $name,
  "password_hash" => $passwordHash,
  "slug" => $slug,
  "abbr" => $abbr
]);

Response::json([
  "ok" => TRUE
]);
