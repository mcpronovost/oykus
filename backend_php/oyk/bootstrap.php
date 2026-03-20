<?php

// CONFIGS
date_default_timezone_set("UTC");
header("Content-Type: application/json; charset=utf-8");

define("OYK", __DIR__);

// CORE FILES
require_once __DIR__ . "/core/db.php";
require_once __DIR__ . "/core/middlewares.php";
require_once __DIR__ . "/core/bus.php";
require_once __DIR__ . "/core/exception.php";
require_once __DIR__ . "/core/response.php";

// Register global exception handler
set_exception_handler("oyk_handle_exceptions");

// Services locators
require_once __DIR__ . "/core/locators.php";


// SERVICES
foreach (glob(__DIR__ . "/contrib/*/services/*.php") as $serviceFile) {
  require_once $serviceFile;
}

