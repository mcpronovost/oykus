<?php

$auth = "/api/v1/auth";
$path = OYK_PATH."/contrib/auth/routes/";

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
