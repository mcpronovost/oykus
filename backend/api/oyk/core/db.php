<?php

$host = getenv("HTTP_DB_HOST");
$name = getenv("HTTP_DB_NAME");
$user = getenv("HTTP_DB_USER");
$pass = getenv("HTTP_DB_PASS");
$charset = "utf8mb4";

$dsn = "mysql:host=$host;port=3306;dbname=$name;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw exceptions on error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,                  // use real prepared statements
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "e" => $e->getMessage()]);
    exit;
}
