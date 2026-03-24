<?php

global $pdo;
$authUserId = require_rat();

$alertId = (int) ($alertId ?? 0);

if ($alertId <= 0) {
  Response::error("Invalid alert ID");
}

$alertService = new AlertService($pdo);
$alertService->markAsRead($authUserId, $alertId);
$unread = $alertService->getUnreadAlertsCount($authUserId);

Response::json([
  "ok" => TRUE,
  "unread" => $unread
]);