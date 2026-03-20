<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS migrations (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `module` varchar(32),
    `filename` varchar(120),
    `executed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
";

$pdo->exec($sql);
echo "Core: migrations table ready.\n";
