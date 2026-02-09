<?php

$api = "/api/v1/achievements";
$view = OYK . "/contrib/achievements/views/";

Router::get("{$api}", "{$view}achievements.php");
