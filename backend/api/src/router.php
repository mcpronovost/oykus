<?php

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'GET' && $path === '/api/health') {
    echo json_encode(['status' => 'ok']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);