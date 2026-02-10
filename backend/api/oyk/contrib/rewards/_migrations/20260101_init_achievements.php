<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS rewards_achievements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    tag VARCHAR(120) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NULL,

    category VARCHAR(120) NOT NULL,
    goal INT UNSIGNED DEFAULT 0,
    period ENUM('daily', 'weekly', 'monthly', 'one-time') NOT NULL,

    is_active TINYINT(1) NOT NULL DEFAULT 1,
    is_hidden TINYINT(1) NOT NULL DEFAULT 0,

    UNIQUE KEY uniq_tag (tag),

    KEY idx_category (category)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
