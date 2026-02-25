<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_assignees (
    `task_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (task_id, user_id),

    CONSTRAINT fk_pa_task
        FOREIGN KEY (task_id) REFERENCES planner_tasks(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pa_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
