<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_tasks (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    `universe_id` INT UNSIGNED NULL,
    `status_id` INT UNSIGNED NOT NULL,
    `author_id` INT UNSIGNED NOT NULL,

    `title` VARCHAR(120) NOT NULL,
    `content` TEXT NULL,

    `priority` TINYINT UNSIGNED NOT NULL DEFAULT 2,

    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `due_at` DATETIME,

    INDEX (universe_id, status_id, priority, due_at),

    CONSTRAINT fk_pt_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_pt_status
        FOREIGN KEY (status_id) REFERENCES planner_statuses(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_pt_author
        FOREIGN KEY (author_id) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
