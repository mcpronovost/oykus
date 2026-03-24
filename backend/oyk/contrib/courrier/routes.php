<?php

$api = "/api/courrier";
$view = OYK . "/contrib/courrier/views/";

Router::post("{$api}/alerts", "{$view}alerts/list.php");

Router::get("{$api}/alerts/{alertsOffset}", "{$view}alerts/list.php");
