<?php
global $pdo;

$pdo->exec("CREATE TABLE IF NOT EXISTS world_geo_zones (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,

    `name` varchar(120) NOT NULL,
    `slug` varchar(120) NOT NULL,
    `is_slug_auto` tinyint(1) NOT NULL DEFAULT 1,
    `description` text,
    `cover` varchar(255),

    `visibility` tinyint NOT NULL DEFAULT 6,
    `position` tinyint NOT NULL DEFAULT 1,

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE
) ENGINE=InnoDB;");

$pdo->exec("CREATE TABLE IF NOT EXISTS world_geo_sectors (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    `zone_id` int UNSIGNED NOT NULL,

    `name` varchar(120) NOT NULL,
    `slug` varchar(120) NOT NULL,
    `is_slug_auto` tinyint(1) NOT NULL DEFAULT 1,
    `description` text,
    `cover` varchar(255),

    `visibility` tinyint NOT NULL DEFAULT 6,
    `position` tinyint NOT NULL DEFAULT 1,
    `col` tinyint NOT NULL DEFAULT 100,

    `is_locked` tinyint(1) NOT NULL DEFAULT 0,

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES world_geo_zones(id) ON DELETE RESTRICT
) ENGINE=InnoDB;");

$pdo->exec("CREATE TABLE IF NOT EXISTS world_geo_divisions (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    `zone_id` int UNSIGNED NOT NULL,
    `sector_id` int UNSIGNED NOT NULL,

    `name` varchar(120) NOT NULL,
    `slug` varchar(120) NOT NULL,
    `is_slug_auto` tinyint(1) NOT NULL DEFAULT 1,
    `description` text,
    `cover` varchar(255),

    `visibility` tinyint NOT NULL DEFAULT 6,
    `position` tinyint NOT NULL DEFAULT 1,
    `col` tinyint NOT NULL DEFAULT 100,

    `is_locked` tinyint(1) NOT NULL DEFAULT 0,

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES world_geo_zones(id) ON DELETE RESTRICT,
    FOREIGN KEY (sector_id) REFERENCES world_geo_sectors(id) ON DELETE RESTRICT
) ENGINE=InnoDB;");
