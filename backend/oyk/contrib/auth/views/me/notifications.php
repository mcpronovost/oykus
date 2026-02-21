<?php

global $pdo;
$authUser = require_auth();

$notificationService = new NotificationService($pdo);

$notifications = $notificationService->getNotificationsCounts($authUser["id"]);

Response::json($notifications);
