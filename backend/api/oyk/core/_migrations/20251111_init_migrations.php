<?php
require_once __DIR__ . "/../../core/db.php";

$sql = "
CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(32),
    filename VARCHAR(120),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
";

$pdo->exec($sql);
echo "Core: migrations table ready.\n";
