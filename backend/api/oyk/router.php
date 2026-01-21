<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__."/core/db.php";
require_once __DIR__."/core/middlewares.php";

$method = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

update_wio();

if ($method === "GET" && $path === "/api/health") {
    require __DIR__."/core/scripts/migrate.php";
    echo json_encode(["ok" => true]);
    exit;
}

// AUTH ROUTES

$prefix = "/api/v1/auth";
$route = "/contrib/auth/routes/";

if ($method === "POST" && $path === $prefix."/register/") {
    require __DIR__ . $route."register.php";
    exit;
}
if ($method === "POST" && $path === $prefix."/login/") {
    require __DIR__ . $route."login.php";
    exit;
}
if ($method === "POST" && $path === $prefix."/logout/") {
    require __DIR__ . $route."logout.php";
    exit;
}
if ($method === "GET" && $path === $prefix."/me/") {
    require __DIR__ . $route."me.php";
    exit;
}
if ($method === "POST" && $path === $prefix."/me/edit/") {
    require __DIR__ . $route."me_edit.php";
    exit;
}
if ($method === "GET" && preg_match("#^".$prefix."/users/([a-z0-9-]+)/profile/?$#", $path, $matches)) {
    $userSlug = $matches[1];
    require __DIR__.$route."users_profile.php";
    exit;
}

// TASKS ROUTES

$prefix = "/api/v1/tasks";
$route = "/contrib/tasks/routes/";

if ($method === "GET" && $path === $prefix."/") {
    require __DIR__.$route."tasks.php";
    exit;
}
if ($method === "POST" && $path === $prefix."/create/") {
    require __DIR__.$route."tasks_create.php";
    exit;
}
if ($method === "POST" && preg_match("#^".$prefix."/([0-9]+)/edit/?$#", $path, $matches)) {
    $taskId = $matches[1];
    require __DIR__.$route."tasks_edit.php";
    exit;
}
if ($method === "POST" && $path === $prefix."/status/create/") {
    require __DIR__.$route."status_create.php";
    exit;
}
if ($method === "POST" && $path === $prefix."/status/edit/") {
    require __DIR__.$route."status_edit.php";
    exit;
}

// WIO ROUTES

$prefix = "/api/v1/wio";
$route = "/contrib/wio/routes/";

if ($method === "GET" && $path === $prefix."/") {
    require __DIR__.$route."wio.php";
    exit;
}

// 404 ERROR

http_response_code(404);
echo json_encode(["error" => "Not found"]);