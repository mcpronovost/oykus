<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_statuses (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NULL,

    `title` varchar(120) NOT NULL,
    `color` char(7) NULL,
    `position` tinyint UNSIGNED NOT NULL DEFAULT 1,
    `is_completed` tinyint(1) NOT NULL DEFAULT 0,

    UNIQUE (position, universe_id),

    CONSTRAINT fk_ps_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;
";

$pdo->exec($sql);
