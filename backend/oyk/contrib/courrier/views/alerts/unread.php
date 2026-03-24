<?php

global $pdo;
$authUserId = require_rat();

$alertsOffset ??= 0;

$alertService = new AlertService($pdo);

$alerts = $alertService->getAlertsList($authUserId, $alertsOffset, TRUE);

Response::json([
  "ok" => TRUE,
  "alerts" => $alerts
]);
