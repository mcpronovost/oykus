<?php

global $pdo;

$universeSlug = $_COOKIE["oyk-world"] ?? NULL;

// Auth needed but silent (if invalid token → no crash)
$userId = require_rat(FALSE);
if (!$userId) {
  return;
}

// Services
try {
  $userService = new UserService($pdo);
  $universeService = new UniverseService($pdo);
  $themeService = new ThemeService($pdo);
  $moduleService = new ModuleService($pdo);
  $notificationService = new NotificationService($pdo);
}
catch (Exception) {
  // fail silently
}

// USER
$user = $userService->getCurrentUser($userId);

// WORLD
try {
  $currentUniverse = $universeService->getUniverse($universeSlug, $userId);
  $universes = $universeService->getUniverses($userId ?? NULL);
  $theme = $currentUniverse ? $themeService->getActiveTheme($currentUniverse["id"]) : NULL;
  if ($currentUniverse) {
    $modules = $moduleService->getModules($currentUniverse["id"]);
    $currentUniverse["modules"] = $modules;
  }
}
catch (Exception) {
  // fail silently
}

// NOTIFICATIONS
try {
  $notifications = $notificationService->getNotificationsCounts($userId);
}
catch (Exception) {
  // fail silently
}

// Response
Response::json([
  "ok" => TRUE,
  "user" => $user,
  "world" => [
    "current" => $currentUniverse ?? NULL,
    "universes" => $universes ?? NULL,
    "theme" => $theme ?? NULL,
  ],
  "notifications" => $notifications ?? NULL,
]);
