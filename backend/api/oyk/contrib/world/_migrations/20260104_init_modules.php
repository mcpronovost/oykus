<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS world_modules (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    universe INT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL,

    is_active BOOL NOT NULL DEFAULT 0,
    is_disabled BOOL NOT NULL DEFAULT 0,

    settings JSON NOT NULL,

    INDEX idx_universe (universe),

    CONSTRAINT uq_name_universe UNIQUE (name, universe),

    CONSTRAINT fk_world_modules_universe
        FOREIGN KEY (universe) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
