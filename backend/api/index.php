<?php

header("Content-Type: application/json; charset=utf-8");

define("JWT_SECRET", $_SERVER["JWT_SECRET"] ?? getenv("JWT_SECRET"));
define("JWT_ISSUER", "oykus");
define("JWT_EXPIRATION", 3600 * 24 * 30);

require_once __DIR__ . "/oyk/router.php";

?>