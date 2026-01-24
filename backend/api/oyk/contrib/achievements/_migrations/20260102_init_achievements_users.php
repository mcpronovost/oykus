<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS achievements_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,
    achievement_id INT UNSIGNED NOT NULL,

    progress INT UNSIGNED NOT NULL DEFAULT 0,
    unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reset_at DATETIME NULL,

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
