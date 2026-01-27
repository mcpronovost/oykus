<?php

$api = "/api/v1/achievements";
$path = OYK_PATH."/contrib/achievements/views/";

route("GET", "#^$api$#", fn() =>
    require $path."achievements.php"
);
