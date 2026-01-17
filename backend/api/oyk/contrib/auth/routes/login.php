<?php

header("Content-Type: application/json");

require __DIR__ . "/../../../core/db.php";
require_once __DIR__ . "/../../../core/utils/jwt.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

// Récupérer l'utilisateur
$stmt = $pdo->prepare("
    SELECT id, username, password, name
    FROM users
    WHERE username = :username
    LIMIT 1
");
$stmt->execute(["username" => $username]);

$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password"])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

// Générer le JWT
$token = generate_jwt([
    "sub"      => $user["id"],
    "username" => $user["username"]
]);

echo json_encode([
    "ok" => true,
    "user" => [
        "name" => $user["name"]
    ],
    "token"  => $token
]);
