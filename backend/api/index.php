<?php

require_once __DIR__ . "/oyk/bootstrap.php";
require_once __DIR__ . "/oyk/core/router.php";

update_wio();

Router::get("/api/health", __DIR__ . "/oyk/core/scripts/migrate.php");
Router::get("/api/v1/theme.php", __DIR__ . "/theme.php");

require OYK . "/contrib/auth/routes.php";
require OYK . "/contrib/world/routes.php";

require OYK . "/contrib/blog/routes.php";
require OYK . "/contrib/planner/routes.php";
require OYK . "/contrib/rewards/routes.php";

Router::dispatch();
