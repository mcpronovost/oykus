<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE auth_friends (
    user_id INT UNSIGNED NOT NULL,
    friend_id INT UNSIGNED NOT NULL,

    status ENUM('pending', 'accepted', 'rejected', 'blocked') NOT NULL DEFAULT 'pending',

    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME NULL,

    PRIMARY KEY (user_id, friend_id),

    CONSTRAINT fk_auth_friends_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_auth_friends_friend
        FOREIGN KEY (friend_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,

    CHECK (user_id <> friend_id),

    INDEX idx_friend_id (friend_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;
";

$pdo->exec($sql);