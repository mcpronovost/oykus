<?php
require_once __DIR__ . "/../../../core/db.php";

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        universe INT UNSIGNED NULL,

        title VARCHAR(120) NOT NULL,
        description VARCHAR(120) NULL,
        content TEXT NULL,
        author INT UNSIGNED NULL,

        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        CONSTRAINT fk_blog_posts_universe
            FOREIGN KEY (universe) REFERENCES world_universes(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_blog_posts_author
            FOREIGN KEY (author) REFERENCES auth_users(id)
            ON DELETE SET NULL
    ) ENGINE=InnoDB;
    ";

    $pdo->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}
