<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS auth_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL,
    is_slug_auto BOOL NOT NULL DEFAULT 1,
    abbr VARCHAR(3) NOT NULL,
    is_abbr_auto BOOL NOT NULL DEFAULT 1,

    avatar VARCHAR(255),
    cover VARCHAR(255),

    is_active BOOL NOT NULL DEFAULT 1,
    is_dev BOOL NOT NULL DEFAULT 0,

    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC'

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uniq_username (username),
    UNIQUE INDEX uniq_email (email),
    UNIQUE INDEX uniq_name (name),

    INDEX idx_slug (slug)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
