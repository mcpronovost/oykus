<?php
require_once __DIR__ . "/../db.php";

try {
    $pdo->exec("TRUNCATE TABLE auth_wio");
    echo "auth_wio table truncated successfully.";
} catch (PDOException $e) {
    http_response_code(500);
    echo "Error truncating auth_wio: " . $e->getMessage();
}
