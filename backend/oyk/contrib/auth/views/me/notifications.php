<?php

global $pdo;
$userId = require_rat();

$notificationService = new NotificationService($pdo);

$notifications = $notificationService->getNotificationsCounts($userId);

Response::json($notifications);
