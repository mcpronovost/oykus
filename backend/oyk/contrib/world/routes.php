<?php

$api = "/api/world";
$view = OYK . "/contrib/world/views/";

Router::get("{$api}/universes", "{$view}universes/list_user.php");

Router::get("{$api}/universes/list", "{$view}universes/list.php");

Router::get("{$api}/universes/{universeSlug}", "{$view}universes/universe.php");

Router::post("{$api}/universes/{universeSlug}/edit", "{$view}universes/edit.php");

// MODULES

Router::get("{$api}/universes/{universeSlug}/modules", "{$view}modules/list.php");

Router::post("{$api}/universes/{universeSlug}/modules/edit", "{$view}modules/edit.php");

Router::get("{$api}/universes/{universeSlug}/modules/{moduleName}", "{$view}modules/module.php");

Router::post("{$api}/universes/{universeSlug}/modules/{moduleName}/edit", "{$view}modules/edit.php");

// THEMES

Router::get("{$api}/universes/{universeSlug}/theme", "{$view}universes/theme.php");

Router::post("{$api}/universes/{universeSlug}/theme/edit", "{$view}universes/theme_edit.php");

// CHARACTERS

Router::get("{$api}/universes/{universeSlug}/community", "{$view}characters/community.php");

Router::get("{$api}/universes/{universeSlug}/community/{characterSlug}", "{$view}characters/profile.php");

// GEO

Router::get("{$api}/universes/{universeSlug}/geo/list", "{$view}geo/list.php");

Router::post("{$api}/universes/{universeSlug}/geo/list/edit", "{$view}geo/list_edit.php");

Router::post("{$api}/universes/{universeSlug}/geo/zones/create", "{$view}geo/zones_create.php");

Router::post("{$api}/universes/{universeSlug}/geo/sectors/create", "{$view}geo/sectors_create.php");

Router::post("{$api}/universes/{universeSlug}/geo/sectors/{sectorId}/edit", "{$view}geo/sectors_edit.php");
