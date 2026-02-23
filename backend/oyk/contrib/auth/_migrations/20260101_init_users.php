<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS auth_users (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
    `email` varchar(120) NOT NULL,
    `password` varchar(255) NOT NULL,

    `name` varchar(120) NOT NULL,
    `slug` varchar(120) NOT NULL,
    `is_slug_auto` tinyint(1) NOT NULL DEFAULT '1',
    `abbr` varchar(3) NOT NULL,
    `is_abbr_auto` tinyint(1) NOT NULL DEFAULT '1',

    `avatar` varchar(255) DEFAULT NULL,
    `cover` varchar(255) DEFAULT NULL,

    `timezone` varchar(64) NOT NULL DEFAULT 'UTC',

    `is_active` tinyint(1) NOT NULL DEFAULT '1',
    `is_dev` tinyint(1) NOT NULL DEFAULT '0',
    `is_banned` tinyint(1) NOT NULL DEFAULT '0',

    `banned_until` datetime DEFAULT NULL,
    `banned_reason` text,
    `locked_until` datetime DEFAULT NULL,
    `failedlogin_at` datetime DEFAULT NULL,
    `failedlogin_count` tinyint NOT NULL DEFAULT '0',

    `lastlogin_at` datetime DEFAULT NULL,
    `lastlogin_ip` varchar(64) DEFAULT NULL,
    `lastlive_at` datetime DEFAULT NULL,
    `lastlive_ip` varchar(64) DEFAULT NULL,

    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uniq_username (username),
    UNIQUE INDEX uniq_email (email),
    UNIQUE INDEX uniq_name (name),
    UNIQUE INDEX uniq_slug (slug)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
