<?php
global $pdo;

$pdo->exec("CREATE TABLE IF NOT EXISTS game_attributes (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    
    `name` VARCHAR(64) NOT NULL,
    `description` text,

    UNIQUE (universe_id, name),

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE
) ENGINE=InnoDB;");

$pdo->exec("CREATE TABLE IF NOT EXISTS game_skills (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    `attribute_id` int UNSIGNED NOT NULL,
    
    `name` VARCHAR(120) NOT NULL,
    `description` text,

    UNIQUE (universe_id, name),

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES game_attributes(id) ON DELETE CASCADE
) ENGINE=InnoDB;");
