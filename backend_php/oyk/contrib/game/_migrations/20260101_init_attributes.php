<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_attributes (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    
    `name` VARCHAR(64) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,

    UNIQUE (universe_id, slug),

    CONSTRAINT fk_wua_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
