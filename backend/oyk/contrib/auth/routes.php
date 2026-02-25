<?php

$api = "/api/v1/auth";
$view = OYK . "/contrib/auth/views/";

Router::post("{$api}/register", "{$view}register.php");

Router::post("{$api}/login", "{$view}login.php");

Router::post("{$api}/refresh", "{$view}refresh.php");

Router::post("{$api}/logout", "{$view}logout.php");

/* ================================================ */
// ME ROUTES
/* ================================================ */

Router::get("{$api}/me", "{$view}me/me.php");

Router::post("{$api}/me/edit", "{$view}me/edit.php");

Router::get("{$api}/me/account", "{$view}me/account.php");

Router::post("{$api}/me/account/edit", "{$view}me/account_edit.php");

/* ================================================ */
// USERS ROUTES
/* ================================================ */

Router::get("{$api}/users/{userSlug}/profile", "{$view}users_profile.php");

/* ================================================ */
// WIO ROUTES
/* ================================================ */

Router::get("{$api}/wio", "{$view}wio.php");
