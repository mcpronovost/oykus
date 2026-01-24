<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS tasks_status (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    color CHAR(7) NULL,
    position TINYINT UNSIGNED DEFAULT 1,
    is_completed BOOL NOT NULL DEFAULT 0
) ENGINE=InnoDB;
";

$pdo->exec($sql);
