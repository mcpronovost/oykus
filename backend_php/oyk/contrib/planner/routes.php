<?php

$api = "/api/v1/planner";
$view = OYK . "/contrib/planner/views/";

Router::get("{$api}/tasks", "{$view}tasks.php");
Router::get("{$api}/u/{universeSlug}/tasks", "{$view}tasks.php");

Router::post("{$api}/tasks/create", "{$view}task_create.php");
Router::post("{$api}/u/{universeSlug}/tasks/create", "{$view}task_create.php");

Router::post("{$api}/tasks/{taskId}/edit", "{$view}task_edit.php");
Router::post("{$api}/u/{universeSlug}/tasks/{taskId}/edit", "{$view}task_edit.php");

Router::post("{$api}/tasks/{taskId}/delete", "{$view}task_delete.php");
Router::post("{$api}/u/{universeSlug}/tasks/{taskId}/delete", "{$view}task_delete.php");

Router::post("{$api}/statuses/create", "{$view}status_create.php");
Router::post("{$api}/u/{universeSlug}/statuses/create", "{$view}status_create.php");

Router::post("{$api}/statuses/{statusId}/edit", "{$view}status_edit.php");
Router::post("{$api}/u/{universeSlug}/statuses/{statusId}/edit", "{$view}status_edit.php");

Router::post("{$api}/statuses/{statusId}/delete", "{$view}status_delete.php");
Router::post("{$api}/u/{universeSlug}/statuses/{statusId}/delete", "{$view}status_delete.php");
