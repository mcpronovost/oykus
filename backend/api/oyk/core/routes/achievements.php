<?php

$api = "/api/v1/achievements";
$path = OYK_PATH."/contrib/achievements/routes/";

route("GET", "#^$api$#", fn() =>
    require $path."achievements.php"
);
