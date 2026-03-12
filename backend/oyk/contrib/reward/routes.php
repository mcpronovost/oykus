<?php

$api = "/api/v1/reward";
$view = OYK . "/contrib/reward/views/";

Router::get("{$api}/u/{universeSlug}/titles", "{$view}titles/list.php");
