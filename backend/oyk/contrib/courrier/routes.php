<?php

$api = "/api/courrier";
$view = OYK . "/contrib/courrier/views/";

Router::get("{$api}/alerts", "{$view}alerts/list.php");

Router::get("{$api}/alerts/{alertsOffset}", "{$view}alerts/list.php");

Router::get("{$api}/alerts/unread/{alertsOffset}", "{$view}alerts/unread.php");

Router::post("{$api}/alerts/{alertId}/read", "{$view}alerts/read.php");
