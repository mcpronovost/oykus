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

Router::get("{$api}/me/notifications", "{$view}me/notifications.php");

/* ================================================ */
// USERS ROUTES
/* ================================================ */

Router::get("{$api}/users/{slug}/profile", "{$view}users_profile.php");

/* ================================================ */
// FRIENDS ROUTES
/* ================================================ */

Router::get("{$api}/friends", "{$view}friends/friends.php");

Router::get("{$api}/friends/requests", "{$view}friends/requests.php");

Router::post("{$api}/friends/add", "{$view}friends/add.php");

Router::post("{$api}/friends/accept", "{$view}friends/accept.php");

Router::post("{$api}/friends/reject", "{$view}friends/reject.php");

Router::post("{$api}/friends/cancel", "{$view}friends/cancel.php");

Router::post("{$api}/friends/delete", "{$view}friends/delete.php");

/* ================================================ */
// WIO ROUTES
/* ================================================ */

Router::get("{$api}/wio", "{$view}wio.php");
