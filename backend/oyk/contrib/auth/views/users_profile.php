<?php

global $pdo;
$userAuthId = require_rat();

$friendService = new FriendService($pdo);

try {
  $qry = $pdo->prepare("
    SELECT au.id,
           au.name,
           au.slug,
           au.abbr,
           au.avatar,
           au.cover,
           au.meta_bio,
           au.meta_birthday,
           au.meta_country,
           au.meta_job,
           au.meta_mood,
           au.meta_website,
           au.meta_socials,
           au.created_at,
          (
            SELECT COUNT(*)
            FROM world_universes wu
            WHERE wu.owner_id = au.id
          ) AS count_universes_owned,
           (
            SELECT COUNT(*)
            FROM blog_posts bp
            WHERE bp.author_id = au.id
          ) AS count_blog_posts,
          (
            SELECT COUNT(*)
            FROM blog_comments bc
            WHERE bc.author_id = au.id
          ) AS count_blog_comments,
          (
            SELECT COUNT(*)
            FROM blog_reactions br
            WHERE br.user_id = au.id
          ) AS count_blog_reactions
    FROM auth_users au
    WHERE au.slug = ?
    LIMIT 1
  ");

  $qry->execute([$userSlug]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError();
}

if (!$user) {
  Response::notFound("User not found");
}

if (!empty($user["meta_socials"])) {
  $user["meta_socials"] = json_decode($user["meta_socials"], TRUE);
}

$friend = $friendService->getFriendPending($userAuthId, $user["id"]);

$user["friend"] = $friend;

Response::json([
  "ok" => TRUE,
  "user" => $user
]);
