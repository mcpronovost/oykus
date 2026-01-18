<?php

header("Content-Type: application/json");

require OYK_PATH."/core/middlewares.php";
require OYK_PATH."/core/db.php";

$authUser = require_auth();

$data = json_decode(file_get_contents("php://input"), true);

echo json_encode([
    "ok" => true,
    "data" => $data,
    "user" => $authUser,
]);
