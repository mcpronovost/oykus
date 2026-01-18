<?php

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($method === "GET" && $path === "/api/health") {
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
    require __DIR__ . $route ."users_profile.php";
    exit;
}

// 404 ERROR

http_response_code(404);
echo json_encode(["error" => "Not found"]);