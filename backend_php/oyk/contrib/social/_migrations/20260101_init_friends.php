<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE social_friends (
    `user_id` int UNSIGNED NOT NULL,
    `friend_id` int UNSIGNED NOT NULL,

    `status` enum('pending', 'accepted', 'rejected', 'blocked') NOT NULL DEFAULT 'pending',

    `requested_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `responded_at` datetime NULL,

    PRIMARY KEY (user_id, friend_id),

    CHECK (user_id <> friend_id),

    INDEX (user_id, status),

    CONSTRAINT fk_sf_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_sf_friend
        FOREIGN KEY (friend_id) REFERENCES auth_users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
