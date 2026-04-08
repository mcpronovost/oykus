<?php

$api = "/api/game";
$view = OYK . "/contrib/game/views/";

Router::get("{$api}/u/{universeSlug}", "{$view}game.php");
