<?php

$api = "/api/progress";
$view = OYK . "/contrib/progress/views/";

Router::get("{$api}/u/{universeSlug}/titles", "{$view}titles/list.php");

Router::post("{$api}/u/{universeSlug}/titles/create", "{$view}titles/create.php");

Router::post("{$api}/u/{universeSlug}/titles/{titleId}/edit", "{$view}titles/edit.php");

Router::post("{$api}/u/{universeSlug}/titles/{titleId}/delete", "{$view}titles/delete.php");
