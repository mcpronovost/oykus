<?php
global $pdo;

# VISIBILITY
#   1 = OWNER
#   2 = ADMINS
#   3 = MODOS
#   4 = PUBLIC

$sql = "
CREATE TABLE IF NOT EXISTS world_universes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    is_slug_auto BOOL NOT NULL DEFAULT 1,
    abbr VARCHAR(3) NOT NULL,
    is_abbr_auto BOOL NOT NULL DEFAULT 1,

    logo VARCHAR(255),
    cover VARCHAR(255),

    owner INT UNSIGNED NOT NULL,

    is_default BOOL NOT NULL DEFAULT 0,
    is_active BOOL NOT NULL DEFAULT 1,
    
    visibility TINYINT NOT NULL DEFAULT 1,

    is_mod_planner_active BOOL NOT NULL DEFAULT 0,
    is_mod_blog_active BOOL NOT NULL DEFAULT 0,
    is_mod_forum_active BOOL NOT NULL DEFAULT 0,
    is_mod_courrier_active BOOL NOT NULL DEFAULT 0,
    is_mod_collectibles_active BOOL NOT NULL DEFAULT 0,
    is_mod_rewards_active BOOL NOT NULL DEFAULT 0,
    is_mod_game_active BOOL NOT NULL DEFAULT 0,
    is_mod_leveling_active BOOL NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uniq_name (name),

    INDEX idx_slug (slug),
    INDEX idx_owner (owner),

    CONSTRAINT fk_world_universes_owner
        FOREIGN KEY (owner) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner, visibility, is_default)
    VALUES (1, 'Oykus', 'oykus', 'O', 1, 4, 1)
    ON DUPLICATE KEY UPDATE id = 1;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner, visibility)
    VALUES (2, 'Qalatlán', 'qalatlan', 'Q', 1, 1)
    ON DUPLICATE KEY UPDATE id = 1;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner, visibility)
    VALUES (3, 'Edenwood', 'edenwood', 'E', 1, 1)
    ON DUPLICATE KEY UPDATE id = 3;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO world_universes (id, name, slug, abbr, owner, visibility)
    VALUES (4, 'Rhansidor', 'rhansidor', 'R', 1, 3)
    ON DUPLICATE KEY UPDATE id = 4;
")->execute();
