<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS security_logs (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    `module` varchar(32) NULL,
    `tag` varchar(120) NOT NULL,
    `user_id` int UNSIGNED NULL,
    `severity` varchar(12) NOT NULL DEFAULT 'info',
    
    `meta` json NOT NULL,

    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
";

$pdo->exec($sql);
