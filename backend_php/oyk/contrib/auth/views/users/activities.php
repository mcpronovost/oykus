<?php

global $pdo;
$userAuthId = require_rat();

$activitiesOffset ??= 0;

$userService = new UserService($pdo);

$activities = $userService->getUserActivities($userSlug, $activitiesOffset);

Response::json([
  "ok" => TRUE,
  "activities" => $activities
]);
