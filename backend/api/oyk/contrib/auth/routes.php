<?php

$auth = "/api/v1/auth";
$path = OYK_PATH."/contrib/auth/views/";

route("POST", "#^$auth/register$#", fn() =>
    require $path."register.php"
);

route("POST", "#^$auth/login$#", fn() =>
    require $path."login.php"
);

route("POST", "#^$auth/logout$#", fn() =>
    require $path."logout.php"
);

/* ================================================ */
// ME ROUTES
/* ================================================ */

route("GET", "#^$auth/me$#", fn() =>
    require $path."me/me.php"
);

route("POST", "#^$auth/me/edit$#", fn() =>
    require $path."me/edit.php"
);

route("GET", "#^$auth/me/account$#", fn() =>
    require $path."me/account.php"
);

route("POST", "#^$auth/me/account/edit$#", fn() =>
    require $path."me/account_edit.php"
);

route("GET", "#^$auth/me/notifications$#", fn() =>
    require $path."me/notifications.php"
);

/* ================================================ */
// USERS ROUTES
/* ================================================ */

route("GET", "#^$auth/users/([a-z0-9-]+)/profile$#", function ($userSlug) use ($path) {
    require $path."users_profile.php";
});

/* ================================================ */
// FRIENDS ROUTES
/* ================================================ */

route("GET", "#^$auth/friends$#", fn() =>
    require $path."friends/friends.php"
);

route("GET", "#^$auth/friends/requests$#", fn() =>
    require $path."friends/requests.php"
);

route("POST", "#^$auth/friends/add$#", fn() =>
    require $path."friends/add.php"
);

route("POST", "#^$auth/friends/accept$#", fn() =>
    require $path."friends/accept.php"
);

route("POST", "#^$auth/friends/reject$#", fn() =>
    require $path."friends/reject.php"
);

route("POST", "#^$auth/friends/cancel$#", fn() =>
    require $path."friends/cancel.php"
);

route("POST", "#^$auth/friends/delete$#", fn() =>
    require $path."friends/delete.php"
);

/* ================================================ */
// WIO ROUTES
/* ================================================ */

route("GET", "#^$auth/wio$#", fn() =>
    require $path."wio.php"
);
