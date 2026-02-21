<?php

$api = "/api/v1/world";
$view = OYK . "/contrib/world/views/";

Router::get("{$api}/universes", "{$view}universes/universes.php");

Router::get("{$api}/universes/{universeSlug}", "{$view}universes/universe.php");

Router::post("{$api}/universes/{universeSlug}/edit", "{$view}universes/edit.php");

Router::post("{$api}/universes/{universeSlug}/modules/edit", "{$view}modules/edit.php");

Router::get("{$api}/universes/{universeSlug}/modules/{moduleName}", "{$view}modules/module.php");

Router::post("{$api}/universes/{universeSlug}/modules/{moduleName}/edit", "{$view}modules/edit.php");

Router::get("{$api}/universes/{universeSlug}/theme", "{$view}universes/theme.php");

Router::post("{$api}/universes/{universeSlug}/theme/edit", "{$view}universes/theme_edit.php");
