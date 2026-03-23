<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS forum_posts (
            `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `universe_id` int UNSIGNED NOT NULL,
            `category_id` int UNSIGNED NOT NULL,
            `section_id` int UNSIGNED NOT NULL,
            `topic_id` int UNSIGNED NOT NULL,
            `user_id` int UNSIGNED NULL,
            `character_id` int UNSIGNED NULL,

            `tag` enum('rp', 'event', 'lore', 'quest', 'warning', 'system', 'note') DEFAULT 'rp',

            `content` text NOT NULL,
            `hrp` text NULL,

            `is_visible` tinyint(1) DEFAULT 1,
            `is_first` tinyint(1) DEFAULT 0,

            `updated_by` int UNSIGNED NULL,
            `updated_reason` text NULL,
            `updated_count` smallint UNSIGNED NOT NULL DEFAULT 0,

            `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            INDEX (`topic_id`, `created_at`),

            CONSTRAINT fk_fp_universe
                FOREIGN KEY (universe_id) REFERENCES world_universes(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_fp_category
                FOREIGN KEY (category_id) REFERENCES forum_categories(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_fp_section
                FOREIGN KEY (section_id) REFERENCES forum_sections(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_fp_topic
                FOREIGN KEY (topic_id) REFERENCES forum_topics(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_fp_user
                FOREIGN KEY (user_id) REFERENCES auth_users(id)
                ON DELETE SET NULL,
            CONSTRAINT fk_fp_character
                FOREIGN KEY (character_id) REFERENCES world_characters(id)
                ON DELETE SET NULL,
            CONSTRAINT fk_fp_updatedby
                FOREIGN KEY (updated_by) REFERENCES auth_users(id)
                ON DELETE SET NULL
        ) ENGINE=InnoDB;
    ");
} catch (Exception $e) {
    echo $e->getMessage();
}