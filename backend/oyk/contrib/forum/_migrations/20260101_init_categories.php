<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS forum_categories (
            `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `universe_id` int UNSIGNED NOT NULL,

            `title` varchar(120) NOT NULL,
            `description` text NULL,

            `position` tinyint UNSIGNED NOT NULL DEFAULT 1,

            `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_fc_universe
                FOREIGN KEY (universe_id) REFERENCES world_universes(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");
} catch (Exception $e) {
    echo $e->getMessage();
}