<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_items_categories (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    
    `name` varchar(120) NOT NULL,
    `description` text
) ENGINE=InnoDB;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_items (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    `category_id` int UNSIGNED,
    
    `name` varchar(120) NOT NULL,
    `description` text,
    `rarity` ENUM('junk','poor','common','uncommon','rare','epic','legendary','mythic','unique'),
    `weight` decimal(12,4) NOT NULL DEFAULT 0.0000,
    `stack` int UNSIGNED NOT NULL DEFAULT 1,
    `slot` varchar(64),

    `is_carryable` tinyint(1) NOT NULL DEFAULT 0,
    `is_stackable` tinyint(1) NOT NULL DEFAULT 0,
    `is_equippable` tinyint(1) NOT NULL DEFAULT 0,
    `is_craftable` tinyint(1) NOT NULL DEFAULT 0,
    `is_material` tinyint(1) NOT NULL DEFAULT 0,
    `is_edible` tinyint(1) NOT NULL DEFAULT 0,
    `is_fuel` tinyint(1) NOT NULL DEFAULT 0,

    `is_unique` tinyint(1) NOT NULL DEFAULT 0,

    UNIQUE (universe_id, name),

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES game_items_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_items_characters (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `character_id` int UNSIGNED NOT NULL,
    `item_id` int UNSIGNED NOT NULL,
    
    `quantity` decimal(12,4) NOT NULL DEFAULT 1.0000,
    `durability` int UNSIGNED DEFAULT NULL,
    `slot` int UNSIGNED DEFAULT NULL,

    `is_equiped` tinyint(1) NOT NULL DEFAULT 0,

    FOREIGN KEY (character_id) REFERENCES world_characters(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES game_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");
