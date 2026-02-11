<?php

$api = "/api/v1/rewards";
$view = OYK . "/contrib/rewards/views/";

Router::get("{$api}/achievements", "{$view}achievements.php");
