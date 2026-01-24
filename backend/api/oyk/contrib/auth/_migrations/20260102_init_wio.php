<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS auth_wio (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NULL,
    guest_id CHAR(36) NULL,

    lastlive_at DATETIME NOT NULL,

    UNIQUE KEY uniq_user (user_id),
    UNIQUE KEY uniq_guest (guest_id),

    KEY idx_lastlive (lastlive_at)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
