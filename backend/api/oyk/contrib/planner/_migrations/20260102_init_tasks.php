<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(120) NOT NULL,
    content TEXT NULL,

    priority TINYINT UNSIGNED NOT NULL DEFAULT 1,
    status INT UNSIGNED NOT NULL,
    position INT UNSIGNED NOT NULL DEFAULT 0,
    author INT UNSIGNED NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_at DATETIME,

    INDEX idx_status_priority_due (status, priority, due_at),
    INDEX idx_status_position (status, position),
    INDEX idx_author (author),

    FOREIGN KEY (status) REFERENCES planner_status(id) ON DELETE RESTRICT,
    FOREIGN KEY (author) REFERENCES auth_users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
