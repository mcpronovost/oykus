<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS forum_topics (
            `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `universe_id` int UNSIGNED NOT NULL,
            `category_id` int UNSIGNED NOT NULL,
            `section_id` int UNSIGNED NOT NULL,
            `user_id` int UNSIGNED NULL,
            `character_id` int UNSIGNED NULL,

            `title` varchar(120) NOT NULL,
            `description` varchar(255) NULL,

            `is_global` tinyint(1) NOT NULL DEFAULT 0,
            `is_locked` tinyint(1) NOT NULL DEFAULT 0,
            `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
            `priority` tinyint UNSIGNED NOT NULL DEFAULT 0,

            `posts_count` int DEFAULT 0,
            `lastpost_at` DATETIME NULL,

            `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_ft_universe
                FOREIGN KEY (universe_id) REFERENCES world_universes(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_ft_category
                FOREIGN KEY (category_id) REFERENCES forum_categories(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_ft_section
                FOREIGN KEY (section_id) REFERENCES forum_sections(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_ft_user
                FOREIGN KEY (user_id) REFERENCES auth_users(id)
                ON DELETE SET NULL,
            CONSTRAINT fk_ft_character
                FOREIGN KEY (character_id) REFERENCES world_characters(id)
                ON DELETE SET NULL
        ) ENGINE=InnoDB;
    ");
} catch (Exception $e) {
    echo $e->getMessage();
}