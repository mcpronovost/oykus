<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS world_modules (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    `universe_id` int UNSIGNED NOT NULL,
    `core_id` int UNSIGNED NULL,
    `label` varchar(120) NOT NULL,

    `is_active` tinyint(1) NOT NULL DEFAULT 0,
    `is_disabled` tinyint(1) NOT NULL DEFAULT 0,

    `settings` json NOT NULL,

    UNIQUE (label, universe_id),

    INDEX (universe_id),

    CONSTRAINT fk_wm_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
