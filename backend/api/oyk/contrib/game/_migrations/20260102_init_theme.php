<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS game_themes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    universe INT UNSIGNED NOT NULL,

    name VARCHAR(120) NOT NULL,

    c_primary VARCHAR(7) NOT NULL,
    c_primary_fg VARCHAR(7) NOT NULL,
    
    stylesheet JSON NOT NULL,

    is_active BOOL NOT NULL DEFAULT 0,

    INDEX idx_universe (universe),

    FOREIGN KEY (universe) REFERENCES game_universes(id) ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
