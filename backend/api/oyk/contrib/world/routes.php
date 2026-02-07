<?php

$api = "/api/v1/world";
$path = OYK_PATH."/contrib/world/views/";

route("GET", "#^$api/universes$#", fn() =>
    require $path."universes/universes.php"
);

route("GET", "#^$api/universes/([0-9a-z-]+)$#", function ($universeSlug) use ($path) {
    require $path."universes/universe.php";
});

route("POST", "#^$api/universes/([0-9a-z-]+)/edit$#", function ($universeSlug) use ($path) {
    require $path."universes/edit.php";
});

route("POST", "#^$api/universes/([0-9a-z-]+)/modules/edit$#", function ($universeSlug) use ($path) {
    require $path."universes/modules_edit.php";
});

route("GET", "#^$api/universes/([0-9a-z-]+)/theme$#", function ($universeSlug) use ($path) {
    require $path."universes/theme.php";
});

route("POST", "#^$api/universes/([0-9a-z-]+)/theme/edit$#", function ($universeSlug) use ($path) {
    require $path."universes/theme_edit.php";
});