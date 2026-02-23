<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS auth_wio (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    `user_id` int UNSIGNED NULL,
    `guest_id` char(36) NULL,
    `agent` varchar(255) NULL,

    `lastlive_at` datetime NOT NULL,

    UNIQUE INDEX `uniq_user` (user_id),
    UNIQUE INDEX `uniq_guest` (guest_id),

    INDEX `idx_lastlive` (lastlive_at)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
