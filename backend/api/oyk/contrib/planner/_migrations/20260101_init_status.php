<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS planner_status (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(120) NOT NULL,
    color CHAR(7) NULL,
    position SMALLINT UNSIGNED NOT NULL,
    is_completed TINYINT(1) NOT NULL DEFAULT 0,

    UNIQUE INDEX uniq_position (position)
) ENGINE=InnoDB;
";

$pdo->exec($sql);
