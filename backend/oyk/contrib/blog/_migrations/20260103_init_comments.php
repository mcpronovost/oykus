<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_comments (
        `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `post_id` int UNSIGNED NOT NULL,
        `author_id` int UNSIGNED NULL,
        `content` text NOT NULL,

        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        CONSTRAINT fk_bc_post
            FOREIGN KEY (post) REFERENCES blog_posts(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_bc_author
            FOREIGN KEY (author) REFERENCES auth_users(id)
            ON DELETE SET NULL
    ) ENGINE=InnoDB;
    ";

    $pdo->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}
