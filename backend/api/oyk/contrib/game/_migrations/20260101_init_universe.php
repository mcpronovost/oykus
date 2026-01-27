<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS game_universes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    is_slug_auto BOOL NOT NULL DEFAULT 1,
    abbr VARCHAR(3) NOT NULL,
    is_abbr_auto BOOL NOT NULL DEFAULT 1,

    logo VARCHAR(255),
    cover VARCHAR(255),

    c_primary VARCHAR(7) NOT NULL,
    c_primary_fg VARCHAR(7) NOT NULL,

    owner INT UNSIGNED NOT NULL,

    is_active BOOL NOT NULL DEFAULT 1,
    is_public BOOL NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uniq_name (name),

    INDEX idx_slug (slug),
    INDEX idx_owner (owner),

    FOREIGN KEY (owner) REFERENCES auth_users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);

$qry = $pdo->prepare("
    INSERT INTO game_universes (id, name, slug, abbr, c_primary, c_primary_fg, owner, is_public)
    VALUES (1, 'Oykus', 'oykus', 'O', '#3DA5cb', '#FFFFFF', 1, 1)
    ON DUPLICATE KEY UPDATE id = 1;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO game_universes (id, name, slug, abbr, c_primary, c_primary_fg, owner, is_public)
    VALUES (2, 'Edenwood', 'edenwood', 'E', '#2a6b52', '#FFFFFF', 1, 1)
    ON DUPLICATE KEY UPDATE id = 2;
")->execute();

$qry = $pdo->prepare("
    INSERT INTO game_universes (id, name, slug, abbr, c_primary, c_primary_fg, owner, is_public)
    VALUES (3, 'Rhansidor', 'rhansidor', 'R', '#9e4092', '#FFFFFF', 1, 1)
    ON DUPLICATE KEY UPDATE id = 3;
")->execute();
