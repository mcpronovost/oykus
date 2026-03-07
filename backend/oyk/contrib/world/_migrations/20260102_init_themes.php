<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS world_themes (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,

    `name` varchar(120) NOT NULL,

    `c_primary` varchar(7) NOT NULL,
    `c_primary_fg` varchar(7) NOT NULL,
    
    `variables` json NOT NULL,
    `stylesheet` text,

    `is_active` tinyint(1) NOT NULL DEFAULT 0,

    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX (universe_id),

    CONSTRAINT fk_wt_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
