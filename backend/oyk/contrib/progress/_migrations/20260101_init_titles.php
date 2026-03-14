<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS progress_titles (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,

    `target` enum('user', 'character', 'universe') NOT NULL DEFAULT 'user',

    `name` varchar(120) NOT NULL,
    `description` text NULL,

    `how_to_obtain` varchar(120) NULL,
    
    `is_unique` tinyint(1) NOT NULL DEFAULT 0,
    `is_hidden` tinyint(1) NOT NULL DEFAULT 0,

    INDEX (universe_id),
    INDEX (how_to_obtain),
    INDEX (how_to_obtain, is_unique),

    CONSTRAINT fk_rt_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
