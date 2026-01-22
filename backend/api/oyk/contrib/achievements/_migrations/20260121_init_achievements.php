<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS achievements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    achievement_key VARCHAR(120) NOT NULL,

    title VARCHAR(120) NOT NULL,
    description TEXT NULL,

    type VARCHAR(120) NOT NULL,
    goal INT UNSIGNED DEFAULT 0,
    period ENUM('daily', 'weekly', 'monthly', 'one-time') NOT NULL,

    UNIQUE KEY uniq_achievement_key (achievement_key),
    KEY idx_type (type)
) ENGINE=InnoDB;
";

$pdo->exec($sql);

$sql = "
CREATE TABLE IF NOT EXISTS achievements_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,
    achievement_id INT UNSIGNED NOT NULL,

    progress INT UNSIGNED NOT NULL DEFAULT 0,
    unlocked_at DATETIME NULL,
    reseted_at DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    UNIQUE KEY uniq_user_achievement (user_id, achievement_id),
    KEY idx_userid (user_id),
    KEY idx_achievement (achievement_id),

    CONSTRAINT fk_achievement_user
        FOREIGN KEY (achievement_id)
        REFERENCES achievements(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
