<?php

global $pdo;

$universeSlug = $_COOKIE["oyk-world"] ?? null;

// Auth obligatoire mais silencieux (si token invalide → pas de crash)
$authUser = require_auth(FALSE);
if ($authUser["id"] <= -1) {
  Response::unauthorized();
  exit;
}

// Services
$userService = new UserService($pdo);
$universeService = new UniverseService($pdo);
$themeService = new ThemeService($pdo);
$moduleService = new ModuleService($pdo);
$notificationService = new NotificationService($pdo);

// USER
$user = $userService->getCurrentUser($authUser["id"]);

// WORLD
$currentUniverse = $universeService->getUniverse($universeSlug, $authUser["id"]);
$universes = $universeService->getUniverses($authUser["id"] ?? NULL);
$theme = $currentUniverse ? $themeService->getActiveTheme($currentUniverse["id"]) : null;
if ($currentUniverse) {
    $modules = $moduleService->getModules($currentUniverse["id"]);
    $currentUniverse["modules"] = $modules;
}

// NOTIFICATIONS
$notifications = $notificationService->getNotifications($authUser["id"]);

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