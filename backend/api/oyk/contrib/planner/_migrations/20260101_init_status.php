<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_statuses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    universe INT UNSIGNED NULL,

    title VARCHAR(120) NOT NULL,
    color CHAR(7) NULL,
    position TINYINT UNSIGNED NOT NULL DEFAULT 1,
    is_completed TINYINT(1) NOT NULL DEFAULT 0,

    CONSTRAINT uq_position UNIQUE (position, universe),

    CONSTRAINT fk_planner_statuses_universe
        FOREIGN KEY (universe) REFERENCES world_universes(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;
";

$pdo->exec($sql);
