<?php

$view = "/api/v1/game";
$path = OYK_PATH."/contrib/game/views/";

route("GET", "#^$view/universes$#", fn() =>
    require $path."universes/universes.php"
);

route("GET", "#^$view/universes/([0-9a-z-]+)$#", function ($universeSlug) use ($path) {
    require $path."universes/universe.php";
});

route("POST", "#^$view/universes/([0-9a-z-]+)/edit$#", function ($universeSlug) use ($path) {
    require $path."universes/edit.php";
});

route("POST", "#^$view/universes/([0-9a-z-]+)/modules/edit$#", function ($universeSlug) use ($path) {
    require $path."universes/modules_edit.php";
});