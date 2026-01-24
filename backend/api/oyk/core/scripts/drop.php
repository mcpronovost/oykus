<?php
require_once __DIR__ . "/../db.php";

$qry = $pdo->prepare("
    DROP TABLE tasks;
")->execute();
