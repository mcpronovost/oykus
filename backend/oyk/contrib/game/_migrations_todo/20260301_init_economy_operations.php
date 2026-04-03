<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_economy_operations (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    
    `name` varchar(120) NOT NULL,
    `item_id` int UNSIGNED NOT NULL,
    `item_weight` varchar(64) NOT NULL,
    `item_yearly` decimal(12,4) NOT NULL DEFAULT 0.0000,
    `workers_min` int NOT NULL,
    `workers_max` int NOT NULL,

    UNIQUE (universe_id, name),

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES game_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_economy_operations_characters (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `character_id` int UNSIGNED NOT NULL,
    `operation_id` int UNSIGNED NOT NULL,
    
    `name` varchar(120) NOT NULL,
    `item_total` decimal(12,4) NOT NULL DEFAULT 0.0000,
    `item_remains` decimal(12,4) NOT NULL DEFAULT 0.0000,
    `workers_total` int DEFAULT 0,
    `statut` ENUM('inactive','active','depleted') DEFAULT 'inactive',

    `stock_size` decimal(12,4) NOT NULL DEFAULT 0.0000,
    `item_stocked` decimal(12,4) NOT NULL DEFAULT 0.0000,
    
    `started_at` datetime NULL,
    `collected_at` datetime NULL,

    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (character_id) REFERENCES world_characters(id) ON DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES game_economy_operations(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");
