<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS reward_user_titles (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` int UNSIGNED NOT NULL,
    `title_id` int UNSIGNED NOT NULL,

    `source` varchar(255) NULL,

    `is_active` tinyint(1) NOT NULL DEFAULT 0,

    `obtained_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rut_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rut_title
        FOREIGN KEY (title_id) REFERENCES reward_titles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
");
