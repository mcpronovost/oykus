<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS world_characters (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    `universe_id` int UNSIGNED NOT NULL,
    `user_id` int UNSIGNED NOT NULL,

    `name` varchar(120) NOT NULL,
    `slug` varchar(120) NOT NULL,
    `is_slug_auto` tinyint(1) NOT NULL DEFAULT 1,
    `abbr` varchar(3) NOT NULL,
    `is_abbr_auto` tinyint(1) NOT NULL DEFAULT 1,

    `avatar` varchar(255),
    `cover` varchar(255),

    `is_active` tinyint(1) NOT NULL DEFAULT 1,
    `is_valid` tinyint(1) NOT NULL DEFAULT 0,

    `validated_at` datetime NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE (universe_id, name),
    UNIQUE (universe_id, slug),

    CONSTRAINT fk_wc_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wc_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
