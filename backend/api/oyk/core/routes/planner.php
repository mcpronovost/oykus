<?php

$api = "/api/v1/planner";
$path = OYK_PATH."/contrib/planner/routes/";

route("GET", "#^$api/tasks$#", fn() =>
    require $path."tasks.php"
);

route("POST", "#^$api/tasks/create$#", fn() =>
    require $path."tasks_create.php"
);

route("POST", "#^$api/tasks/([0-9]+)/edit$#", function ($taskId) use ($path) {
    require $path."tasks_edit.php";
});

route("POST", "#^$api/status/create$#", fn() =>
    require $path."status_create.php"
);

route("POST", "#^$api/status/([0-9]+)/edit$#", function ($statusId) use ($path) {
    require $path."status_edit.php";
});
