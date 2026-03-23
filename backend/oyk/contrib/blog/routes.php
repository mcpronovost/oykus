<?php

$api = "/api/v1/blog";
$view = OYK . "/contrib/blog/views/";

Router::get("{$api}/u/{universeSlug}/posts", "{$view}posts.php");

Router::get("{$api}/u/{universeSlug}/posts/{postId}", "{$view}post.php");

Router::post("{$api}/u/{universeSlug}/posts/{postId}/edit", "{$view}post_edit.php");

Router::post("{$api}/u/{universeSlug}/posts/{postId}/delete", "{$view}post_delete.php");

Router::post("{$api}/u/{universeSlug}/posts/create", "{$view}post_create.php");

Router::post("{$api}/u/{universeSlug}/posts/{postId}/reaction", "{$view}reaction.php");

Router::get("{$api}/u/{universeSlug}/posts/{postId}/comments", "{$view}post_comments.php");

Router::post("{$api}/u/{universeSlug}/posts/{postId}/comments/create", "{$view}post_comment_create.php");

Router::post("{$api}/u/{universeSlug}/posts/{postId}/comments/{commentId}/reaction", "{$view}reaction.php");
