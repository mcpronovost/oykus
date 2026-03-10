<?php

global $pdo;
$userAuthId = require_rat();

try {
  $qry = $pdo->prepare("
    SELECT au.id,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', t.id,
                'content', t.content,
                'created_at', t.created_at,
                'updated_at', t.updated_at
              )
            )
            FROM (
              SELECT bp.id, bp.content, bp.created_at, bp.updated_at
              FROM blog_posts bp
              WHERE bp.author_id = au.id
              ORDER BY bp.created_at DESC
              LIMIT 5
            ) AS t
          ) AS blog_posts,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', t.id,
                'content', t.content,
                'created_at', t.created_at,
                'updated_at', t.updated_at
              )
            )
            FROM (
              SELECT bc.id, bc.content, bc.created_at, bc.updated_at
              FROM blog_comments bc
              WHERE bc.author_id = au.id
              ORDER BY bc.created_at DESC
              LIMIT 5
            ) AS t
          ) AS blog_comments
    FROM auth_users au
    WHERE au.slug = ?
    LIMIT 1;
  ");

  $qry->execute([$userSlug]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  Response::serverError($e->getMessage());
}

if (!$user) {
  Response::notFound("User not found");
}

$user["blog_posts"] = json_decode($user["blog_posts"], TRUE);
$user["blog_comments"] = json_decode($user["blog_comments"], TRUE);

$activities = [
  ...$user["blog_posts"],
  ...$user["blog_comments"]
];

usort($activities, function ($a, $b) {
  return $b["created_at"] <=> $a["created_at"];
});

Response::json([
  "ok" => TRUE,
  "activities" => $activities
]);
