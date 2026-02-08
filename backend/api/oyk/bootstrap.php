<?php

// CONFIGS
date_default_timezone_set("UTC");
header("Content-Type: application/json; charset=utf-8");

define("OYK_PATH", __DIR__);

// CORE FILES
require_once __DIR__ . "/core/db.php";
require_once __DIR__ . "/core/middlewares.php";
require_once __DIR__ . "/core/bus.php";

// SERVICES
require_once __DIR__ . "/contrib/world/services/UniverseService.php";
require_once __DIR__ . "/contrib/world/services/ThemeService.php";
// require_once __DIR__ . "/contrib/achievements/services/AchievementService.php";

// INIT EventBus / listeners
/*$achievementService = new AchievementService($pdo);

EventBus::listen("user.login", function ($payload) use ($achievementService) {
    $achievementService->handleEvent("user.login", $payload["user_id"]);
});*/
