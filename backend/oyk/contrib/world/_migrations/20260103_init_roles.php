<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS world_roles (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    `user_id` int UNSIGNED NOT NULL,
    `universe_id` int UNSIGNED NOT NULL,

    `role` tinyint UNSIGNED NOT NULL DEFAULT 6,

    INDEX (user_id),
    INDEX (universe_id),

    UNIQUE (user_id, universe_id),

    CONSTRAINT fk_wr_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wr_universe
        FOREIGN KEY (universe_id) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
