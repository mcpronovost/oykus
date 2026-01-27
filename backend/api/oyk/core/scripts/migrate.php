<?php
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/../_migrations/20251111_init_migrations.php";

$modules = ["auth", "game", "planner", "collectibles", "achievements"];

foreach ($modules as $module) {
    $migrationsDir = __DIR__ . "/../../contrib/$module/_migrations";
    if (!is_dir($migrationsDir)) continue;

    $files = scandir($migrationsDir);
    sort($files); // run in order
    foreach ($files as $file) {
        if (preg_match("/\.php$/", $file)) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM migrations WHERE module = ? AND filename = ?");
            $stmt->execute(array($module, $file));
            if ($stmt->fetchColumn()) continue;
            echo "Running migration $module/$file ...\n";
            require $migrationsDir . "/" . $file;
            $query = $pdo->prepare("INSERT INTO migrations (module, filename) VALUES (?,?)");
            $query->execute([$module, $file]);
        }
    }
}
