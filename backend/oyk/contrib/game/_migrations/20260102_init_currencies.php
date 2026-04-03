<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_currencies (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `universe_id` int UNSIGNED NOT NULL,
    
    `name` varchar(120) NOT NULL,
    `icon` varchar(255),
    `symbol` varchar(3),

    `is_user` tinyint(1) NOT NULL DEFAULT 0,
    `is_character` tinyint(1) NOT NULL DEFAULT 0,
    `is_displayed` tinyint(1) NOT NULL DEFAULT 0,

    UNIQUE (universe_id, name),

    FOREIGN KEY (universe_id) REFERENCES world_universes(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_currencies_users (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` int UNSIGNED NOT NULL,
    `currency_id` int UNSIGNED NOT NULL,
    
    `value` int UNSIGNED NOT NULL DEFAULT 0,

    UNIQUE (user_id, currency_id),

    FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE,
    FOREIGN KEY (currency_id) REFERENCES game_currencies(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS game_currencies_characters (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `character_id` int UNSIGNED NOT NULL,
    `currency_id` int UNSIGNED NOT NULL,
    
    `value` int UNSIGNED NOT NULL DEFAULT 0,

    UNIQUE (character_id, currency_id),

    FOREIGN KEY (character_id) REFERENCES world_characters(id) ON DELETE CASCADE,
    FOREIGN KEY (currency_id) REFERENCES game_currencies(id) ON DELETE CASCADE
) ENGINE=InnoDB;
");
