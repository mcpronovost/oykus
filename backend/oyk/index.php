<?php

require_once __DIR__ . "/bootstrap.php";
require_once __DIR__ . "/core/router.php";

oyk_update_wio();

// SPECIAL ROUTES
Router::get("/api/health", __DIR__ . "/core/scripts/migrate.php");
Router::get("/api/v1/theme.php", __DIR__ . "/theme.php");
Router::get("/api/v1/heartbeat", __DIR__ . "/heartbeat.php");

// CORE AND MODS ROUTES
foreach (glob(OYK . "/contrib/*/routes.php") as $routeFile) {
  require_once $routeFile;
}

Router::dispatch();
