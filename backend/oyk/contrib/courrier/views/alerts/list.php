<?php

global $pdo;
$authUserId = require_rat();

$alertsOffset ??= 0;

$alertService = new AlertService($pdo);

$alerts = $alertService->getAlertsList($authUserId, $alertsOffset);

Response::json([
  "ok" => TRUE,
  "alerts" => $alerts
]);
