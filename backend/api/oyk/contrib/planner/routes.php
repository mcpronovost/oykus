<?php

$api = "/api/v1/planner";
$path = OYK . "/contrib/planner/views/";

Router::get("{$api}/tasks", "{$view}tasks.php");

Router::post("{$api}/tasks/create", "{$view}tasks_create.php");

Router::post("{$api}/tasks/{taskId}/edit", "{$view}tasks_edit.php");

Router::post("{$api}/tasks/{taskId}/delete", "{$view}tasks_delete.php");

Router::post("{$api}/status/create", "{$view}status_create.php");

Router::post("{$api}/status/{taskId}/edit", "{$view}status_edit.php");
