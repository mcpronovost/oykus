<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS world_modules_core (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    `label` varchar(120) NOT NULL UNIQUE,
    `description` TEXT NULL,

    `is_visible` tinyint(1) NOT NULL DEFAULT 1,
    `is_available` tinyint(1) NOT NULL DEFAULT 1,
    `settings` json NOT NULL,

    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
");

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('blog', 'mod.blog.description', 1, 1, '{}')
    ON DUPLICATE KEY UPDATE id = 'blog';
")->execute();

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('forum', 'mod.forum.description', 1, 0, '{}')
    ON DUPLICATE KEY UPDATE id = 'forum';
")->execute();

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('game', 'mod.game.description', 1, 0, '{}')
    ON DUPLICATE KEY UPDATE id = 'game';
")->execute();

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('leveling', 'mod.leveling.description', 1, 0, '{}')
    ON DUPLICATE KEY UPDATE id = 'leveling';
")->execute();

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('planner', 'mod.planner.description', 1, 1, '{}')
    ON DUPLICATE KEY UPDATE id = 'planner';
")->execute();

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('collections', 'mod.collections.description', 1, 0, '{}')
    ON DUPLICATE KEY UPDATE id = 'collections';
")->execute();

$pdo->prepare("
    INSERT INTO world_modules_core (label, description, is_visible, is_available, settings)
    VALUES ('rewards', 'mod.rewards.description', 1, 0, '{}')
    ON DUPLICATE KEY UPDATE id = 'rewards';
")->execute();
