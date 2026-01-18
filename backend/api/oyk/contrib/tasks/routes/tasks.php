<?php

header("Content-Type: application/json");

require OYK_PATH."/core/middlewares.php";
require OYK_PATH."/core/db.php";

$authUser = require_auth();

$status = [];
$tasks = [];

echo json_encode([
    "ok" => true,
    "status" => $status,
    "tasks" => $tasks
]);
