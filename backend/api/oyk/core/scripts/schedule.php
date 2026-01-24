<?php
require_once __DIR__ . "/../db.php";

$qry = $pdo->prepare("
    DELETE FROM auth_wio
    WHERE w.lastlive_at < NOW() - INTERVAL 5 MINUTE
");
