<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_skills (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    `attribute_id` int UNSIGNED NOT NULL,
    
    `name` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,

    UNIQUE (universe_id, slug),

    CONSTRAINT fk_wus_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE
    CONSTRAINT fk_wus_attribute
        FOREIGN KEY (attribute_id) REFERENCES game_attributes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
