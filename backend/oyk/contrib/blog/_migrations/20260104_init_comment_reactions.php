<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_comment_reactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        comment INT UNSIGNED NOT NULL,
        user INT UNSIGNED NOT NULL,
        reaction ENUM('like', 'dislike') NOT NULL,

        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_user_comment (user, comment),

        CONSTRAINT fk_blog_comment_reactions_comment
            FOREIGN KEY (comment) REFERENCES blog_comments(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_blog_comment_reactions_user
            FOREIGN KEY (user) REFERENCES auth_users(id)
            ON DELETE CASCADE
    ) ENGINE=InnoDB;
    ";

    $pdo->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}
