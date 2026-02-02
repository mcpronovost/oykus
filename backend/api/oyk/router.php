<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__."/core/db.php";
require_once __DIR__."/core/middlewares.php";

update_wio();

function route(string $method, string $pattern, callable $handler): bool {
    if ($_SERVER["REQUEST_METHOD"] !== $method) {
        return false;
    }

    $path = rtrim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/");
    $path = $path === "" ? "/" : $path;

    if (preg_match($pattern, $path, $matches)) {
        array_shift($matches);
        $handler(...$matches);
        exit;
    }

    return false;
}

route("GET", "#^/api/health$#", function () {
    require __DIR__."/core/scripts/migrate.php";
    echo json_encode(["ok" => true]);
});

route("GET", "#^/api/v1/theme.php$#", function () {
    require __DIR__."/../theme.php";
});

require __DIR__."/contrib/auth/routes.php";
require __DIR__."/contrib/planner/routes.php";
require __DIR__."/contrib/achievements/routes.php";
require __DIR__."/contrib/game/routes.php";

http_response_code(404);
echo json_encode(["error" => "Not found"]);