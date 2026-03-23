<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS progress_titles_users (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` int UNSIGNED NOT NULL,
    `title_id` int UNSIGNED NOT NULL,

    `is_active` tinyint(1) NOT NULL DEFAULT 0,

    `obtained_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX (user_id),
    INDEX (title_id),
    INDEX (user_id, is_active),
    UNIQUE (user_id, title_id),

    CONSTRAINT fk_ptu_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ptu_title
        FOREIGN KEY (title_id) REFERENCES progress_titles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
