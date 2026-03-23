<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS forum_sections (
            `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `universe_id` int UNSIGNED NOT NULL,
            `category_id` int UNSIGNED NOT NULL,
            `parent_id` int UNSIGNED NULL,

            `title` varchar(120) NOT NULL,
            `description` text NULL,

            `cover` varchar(255) NULL,
            `position` tinyint UNSIGNED NOT NULL DEFAULT 1,

            `forum_path` varchar(255) NOT NULL,
            `topics_count` int DEFAULT 0,
            `posts_count` int DEFAULT 0,
            `lastpost_at` DATETIME NULL,

            `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_fs_universe
                FOREIGN KEY (universe_id) REFERENCES world_universes(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_fs_category
                FOREIGN KEY (category_id) REFERENCES forum_categories(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_fs_parent
                FOREIGN KEY (parent_id) REFERENCES forum_sections(id)
                ON DELETE SET NULL
        ) ENGINE=InnoDB;
    ");
} catch (Exception $e) {
    echo $e->getMessage();
}