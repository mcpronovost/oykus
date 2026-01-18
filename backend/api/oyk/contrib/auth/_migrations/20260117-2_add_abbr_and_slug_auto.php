<?php
require_once __DIR__ . "/../../../core/db.php";

$sql = "
ALTER TABLE users ADD (
    is_slug_auto BOOL NOT NULL DEFAULT 1,
    is_abbr_auto BOOL NOT NULL DEFAULT 1,
    is_active BOOL NOT NULL DEFAULT 1,
    is_admin BOOL NOT NULL DEFAULT 0
);
";

$pdo->exec($sql);
