<?php

global $pdo;

$universeSlug = $_COOKIE["oyk-world"] ?? NULL;

// Auth needed but silent (if invalid token → no crash)
$authUserId = require_rat(FALSE);

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
$user = $authUserId ? $userService->getCurrentUser($authUserId) : NULL;

// WORLD
try {
  $currentUniverse = $universeService->getUniverse($universeSlug, $authUserId);
}
catch (Exception) {
  Response::forbidden("Universe not found", ["code" => 403]);
}

try {
  $universes = $universeService->getUniversesForUser($authUserId);
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
  $notifications = $authUserId ? $notificationService->getNotificationsCounts($authUserId) : NULL;
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
