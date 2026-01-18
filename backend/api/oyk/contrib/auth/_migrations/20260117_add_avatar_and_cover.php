<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
ALTER TABLE users ADD (
    avatar VARCHAR(255),
    cover VARCHAR(255)
);
";

$pdo->exec($sql);
