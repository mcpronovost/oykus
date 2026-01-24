<?php

header("Content-Type: application/json");

require __DIR__ . "/../../../core/utils/formatters.php";

global $pdo;

// Get data
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";
$email    = trim($data["email"] ?? "");
$name     = trim($data["name"] ?? "");

// Validations
if (
    $username === "" ||
    $password === "" ||
    $email === "" ||
    $name === "" ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($password) < 8
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

try {
    // Check if username OR email already exists
    $stmt = $pdo->prepare("
        SELECT id FROM auth_users
        WHERE username = :username OR email = :email
        LIMIT 1
    ");
    $stmt->execute([
        "username" => $username,
        "email"    => $email,
    ]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Registration failed"]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$slug = get_slug($pdo, $name, "users");
$abbr = get_abbr($name, 3);

// Create new user
$stmt = $pdo->prepare("
    INSERT INTO auth_users (username, email, name, password, slug, abbr)
    VALUES (:username, :email, :name, :password_hash, :slug, :abbr)
");

$stmt->execute([
    "username"      => $username,
    "email"         => $email,
    "name"          => $name,
    "password_hash" => $passwordHash,
    "slug"          => $slug,
    "abbr"          => $abbr
]);

echo json_encode([
    "ok" => true
]);
