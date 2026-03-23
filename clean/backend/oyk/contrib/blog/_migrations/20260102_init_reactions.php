<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_reactions (
        `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        `universe_id` int UNSIGNED NOT NULL,
        `target_tag` enum('blog', 'post', 'comment') NOT NULL,
        `target_id` int UNSIGNED NOT NULL,

        `reaction` enum('like', 'dislike') NOT NULL,
        `user_id` int UNSIGNED NOT NULL,

        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE (user_id, target_tag, target_id),

        CONSTRAINT fk_br_universe
            FOREIGN KEY (universe_id) REFERENCES world_universes(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_br_user
            FOREIGN KEY (user_id) REFERENCES auth_users(id)
            ON DELETE CASCADE
    ) ENGINE=InnoDB;
    ";

    $pdo->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}
