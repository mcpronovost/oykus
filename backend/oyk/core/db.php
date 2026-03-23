<?php

$host = getenv("HTTP_DB_HOST") or die("Database host not set");
$name = getenv("HTTP_DB_NAME") or die("Database name not set");
$user = getenv("HTTP_DB_USER") or die("Database user not set");
$pass = getenv("HTTP_DB_PASS") or die("Database password not set");
$charset = "utf8mb4";

$dsn = "mysql:host=$host;port=3306;dbname=$name;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw exceptions on error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,                  // use real prepared statements
    Pdo\Mysql::ATTR_INIT_COMMAND => "SET time_zone = '+00:00'",
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo print_r($e, TRUE);
    echo json_encode(["error" => "Database connection failed", "e" => $e->getMessage()]);
    exit;
}
