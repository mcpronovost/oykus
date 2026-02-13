<?php

$api = "/api/v1/blog";
$view = OYK . "/contrib/blog/views/";

Router::get("{$api}/u/{universeSlug}/posts", "{$view}posts.php");

Router::get("{$api}/u/{universeSlug}/posts/{postId}", "{$view}post.php");
