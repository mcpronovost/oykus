<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS progress_titles_characters (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `character_id` int UNSIGNED NOT NULL,
    `title_id` int UNSIGNED NOT NULL,

    `is_active` tinyint(1) NOT NULL DEFAULT 0,

    `obtained_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rct_character
        FOREIGN KEY (character_id) REFERENCES world_characters(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rct_title
        FOREIGN KEY (title_id) REFERENCES progress_titles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
