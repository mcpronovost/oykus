<?php

$api = "/api/v1/reward";
$view = OYK . "/contrib/reward/views/";

Router::get("{$api}/u/{universeSlug}/titles", "{$view}titles/list.php");

Router::post("{$api}/u/{universeSlug}/titles/create", "{$view}titles/create.php");

Router::post("{$api}/u/{universeSlug}/titles/{titleId}/delete", "{$view}titles/delete.php");
