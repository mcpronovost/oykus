<?php

date_default_timezone_set("UTC");

define("OYK_PATH", __DIR__."/oyk");

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/oyk/router.php";

?>