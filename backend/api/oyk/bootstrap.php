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
set_exception_handler("handle_exceptions");


// SERVICES
require_once __DIR__ . "/contrib/world/services/UniverseService.php";
require_once __DIR__ . "/contrib/world/services/ThemeService.php";
require_once __DIR__ . "/contrib/world/services/ModuleService.php";

require_once __DIR__ . "/contrib/blog/services/BlogService.php";
require_once __DIR__ . "/contrib/blog/services/ReactionService.php";

require_once __DIR__ . "/contrib/planner/services/StatusService.php";
require_once __DIR__ . "/contrib/planner/services/TaskService.php";

