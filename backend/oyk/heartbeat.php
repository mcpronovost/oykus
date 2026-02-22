<?php

global $pdo;

$universeSlug = $_COOKIE["oyk-world"] ?? null;

// Auth obligatoire mais silencieux (si token invalide → pas de crash)
$userId = require_rat(FALSE);

// Services
try {
  $userService = new UserService($pdo);
  $universeService = new UniverseService($pdo);
  $themeService = new ThemeService($pdo);
  $moduleService = new ModuleService($pdo);
  $notificationService = new NotificationService($pdo);
} catch (Exception $e) {
  Response::serverError("heartbeat");
}

// USER
$user = $userService->getCurrentUser($userId);

// WORLD
$currentUniverse = $universeService->getUniverse($universeSlug, $userId);
$universes = $universeService->getUniverses($userId ?? NULL);
$theme = $currentUniverse ? $themeService->getActiveTheme($currentUniverse["id"]) : null;
if ($currentUniverse) {
    $modules = $moduleService->getModules($currentUniverse["id"]);
    $currentUniverse["modules"] = $modules;
}

// NOTIFICATIONS
$notifications = $notificationService->getNotificationsCounts($userId);

// Réponse
Response::json([
  "ok" => TRUE,
  "user" => $user,
  "world" => [
    "current" => $currentUniverse,
    "universes" => $universes,
    "theme" => $theme,
  ],
  "notifications" => $notifications,
]);