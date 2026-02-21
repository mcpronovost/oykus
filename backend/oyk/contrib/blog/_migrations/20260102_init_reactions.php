<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_post_reactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        post INT UNSIGNED NOT NULL,
        user INT UNSIGNED NOT NULL,
        reaction ENUM('like', 'dislike') NOT NULL,

        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_user_post (user, post),

        CONSTRAINT fk_blog_post_reactions_post
            FOREIGN KEY (post) REFERENCES blog_posts(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_blog_post_reactions_user
            FOREIGN KEY (user) REFERENCES auth_users(id)
            ON DELETE CASCADE
    ) ENGINE=InnoDB;
    ";

    $pdo->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}
