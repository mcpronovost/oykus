<?php

$host = $_SERVER["DB_HOST"] ?? getenv("DB_HOST");
$name = $_SERVER["DB_NAME"] ?? getenv("DB_NAME");
$user = $_SERVER["DB_USER"] ?? getenv("DB_USER");
$pass = $_SERVER["DB_PASS"] ?? getenv("DB_PASS");
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$name;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw exceptions on error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,                  // use real prepared statements
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "e" => $e->getMessage()]);
    exit;
}
