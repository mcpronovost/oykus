<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_comments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        post INT UNSIGNED NOT NULL,
        author INT UNSIGNED NULL,
        content TEXT NOT NULL,

        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        CONSTRAINT fk_blog_comments_post
            FOREIGN KEY (post) REFERENCES blog_posts(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_blog_comments_author
            FOREIGN KEY (author) REFERENCES auth_users(id)
            ON DELETE SET NULL
    ) ENGINE=InnoDB;
    ";

    $pdo->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}
