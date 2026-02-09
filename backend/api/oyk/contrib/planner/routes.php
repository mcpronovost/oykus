<?php

$api = "/api/v1/planner";
$view = OYK . "/contrib/planner/views/";

Router::get("{$api}/tasks", "{$view}tasks.php");
Router::get("{$api}/u/{universeSlug}/tasks", "{$view}tasks.php");

Router::post("{$api}/tasks/create", "{$view}tasks_create.php");
Router::post("{$api}/u/{universeSlug}/tasks/create", "{$view}tasks_create.php");

Router::post("{$api}/tasks/{taskId}/edit", "{$view}tasks_edit.php");
Router::post("{$api}/u/{universeSlug}/tasks/{taskId}/edit", "{$view}tasks_edit.php");

Router::post("{$api}/tasks/{taskId}/delete", "{$view}tasks_delete.php");
Router::post("{$api}/u/{universeSlug}/tasks/{taskId}/delete", "{$view}tasks_delete.php");

Router::post("{$api}/status/create", "{$view}status_create.php");
Router::post("{$api}/u/{universeSlug}/status/create", "{$view}status_create.php");

Router::post("{$api}/status/{statusId}/edit", "{$view}status_edit.php");
Router::post("{$api}/u/{universeSlug}/status/{statusId}/edit", "{$view}status_edit.php");
