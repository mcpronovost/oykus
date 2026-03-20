<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS auth_wio (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    `user_id` int UNSIGNED NULL UNIQUE,
    `guest_id` char(36) NULL UNIQUE,
    `agent` varchar(255) NULL,

    `lastlive_at` datetime NOT NULL,

    INDEX (lastlive_at)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
