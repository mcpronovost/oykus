<?php

$api = "/api/game";
$view = OYK . "/contrib/game/views/";

Router::get("{$api}/u/{universeSlug}", "{$view}game.php");

Router::get("{$api}/u/{universeSlug}/zones/{zoneId}", "{$view}game_zone.php");

Router::get("{$api}/u/{universeSlug}/sectors/{sectorId}", "{$view}game_sector.php");
