<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS auth_wio (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NULL,
    guest_id CHAR(36) NULL,
    agent VARCHAR(255) NULL,

    lastlive_at DATETIME NOT NULL,

    UNIQUE INDEX uniq_user (user_id),
    UNIQUE INDEX uniq_guest (guest_id),

    INDEX idx_lastlive (lastlive_at)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
