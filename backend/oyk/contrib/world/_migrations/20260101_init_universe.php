<?php
global $pdo;

# VISIBILITY
#   1 = OWNER
#   2 = ADMINS
#   3 = MODOS
#   4 = MEMBERS
#   5 = VISITORS
#   6 = PUBLIC

$sql = "
CREATE TABLE IF NOT EXISTS world_universes (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    `name` varchar(120) NOT NULL UNIQUE,
    `slug` varchar(120) NOT NULL UNIQUE,
    `is_slug_auto` tinyint(1) NOT NULL DEFAULT 1,
    `abbr` varchar(3) NOT NULL,
    `is_abbr_auto` tinyint(1) NOT NULL DEFAULT 1,

    `logo` varchar(255),
    `cover` varchar(255),

    `owner_id` int UNSIGNED NOT NULL,

    `is_default` tinyint(1) NOT NULL DEFAULT 0,
    `is_active` tinyint(1) NOT NULL DEFAULT 1,
    
    `visibility` tinyint NOT NULL DEFAULT 1,

    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX (owner_id),

    CONSTRAINT fk_wu_owner
        FOREIGN KEY (owner_id) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner_id, visibility, is_default)
    VALUES (1, 'Oykus', 'oykus', 'O', 1, 4, 1)
    ON DUPLICATE KEY UPDATE id = 1;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner_id, visibility)
    VALUES (2, 'Qalatlán', 'qalatlan', 'Q', 1, 1)
    ON DUPLICATE KEY UPDATE id = 1;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner_id, visibility)
    VALUES (3, 'Edenwood', 'edenwood', 'E', 1, 1)
    ON DUPLICATE KEY UPDATE id = 3;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner_id, visibility)
    VALUES (4, 'Rhansidor', 'rhansidor', 'R', 1, 3)
    ON DUPLICATE KEY UPDATE id = 4;
")->execute();
