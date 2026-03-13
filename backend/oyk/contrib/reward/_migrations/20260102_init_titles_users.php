<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS reward_titles_users (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` int UNSIGNED NOT NULL,
    `title_id` int UNSIGNED NOT NULL,

    `is_active` tinyint(1) NOT NULL DEFAULT 0,

    `obtained_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEDX (user_id),
    INDEDX (title_id),
    INDEDX (user_id, is_active),
    UNIQUE (user_id, title_id),

    CONSTRAINT fk_rut_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rut_title
        FOREIGN KEY (title_id) REFERENCES reward_titles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
