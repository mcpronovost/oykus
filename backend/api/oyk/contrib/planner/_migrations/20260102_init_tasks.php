<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    universe INT UNSIGNED NULL,

    title VARCHAR(120) NOT NULL,
    content TEXT NULL,

    priority TINYINT UNSIGNED NOT NULL DEFAULT 2,
    status INT UNSIGNED NOT NULL,
    position INT UNSIGNED NOT NULL DEFAULT 1,
    author INT UNSIGNED NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_at DATETIME,

    INDEX idx_status_priority_due (status, priority, due_at),
    INDEX idx_status_position (status, position),
    INDEX idx_author (author),

    CONSTRAINT fk_planner_tasks_universe
        FOREIGN KEY (universe) REFERENCES world_universes(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_planner_tasks_status
        FOREIGN KEY (status) REFERENCES planner_status(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_planner_tasks_author
        FOREIGN KEY (author) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
