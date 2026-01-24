<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS achievements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(120) NOT NULL,

    title VARCHAR(120) NOT NULL,
    description TEXT NULL,

    category VARCHAR(120) NOT NULL,
    goal INT UNSIGNED DEFAULT 0,
    period ENUM('daily', 'weekly', 'monthly', 'one-time') NOT NULL,

    UNIQUE KEY uniq_tag (tag),

    KEY idx_category (category)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
