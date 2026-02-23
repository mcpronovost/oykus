<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS security_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    module VARCHAR(32) NULL,
    tag VARCHAR(120) NOT NULL,
    user_id INT UNSIGNED NULL,
    severity VARCHAR(12) NOT NULL DEFAULT 'info',
    
    meta JSON NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
";

$pdo->exec($sql);
