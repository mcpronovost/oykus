<?php

$api = "/api/v1/social";
$view = OYK . "/contrib/social/views/";

Router::get("{$api}/friends", "{$view}friends/friends.php");

Router::get("{$api}/friends/requests", "{$view}friends/requests.php");

Router::post("{$api}/friends/add", "{$view}friends/add.php");

Router::post("{$api}/friends/accept", "{$view}friends/accept.php");

Router::post("{$api}/friends/reject", "{$view}friends/reject.php");

Router::post("{$api}/friends/cancel", "{$view}friends/cancel.php");

Router::post("{$api}/friends/delete", "{$view}friends/delete.php");
