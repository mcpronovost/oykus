<?php

global $pdo;
$userAuthId = require_rat();

$titleService = new TitleService($pdo);

try {
  $qry = $pdo->prepare("
    SELECT meta_bio,
           meta_birthday,
           meta_country,
           meta_job,
           meta_mood,
           meta_website,
           created_at
    FROM auth_users
    WHERE id = ?
    LIMIT 1
  ");

  $qry->execute([$userAuthId]);
  $user = $qry->fetch();
}
catch (Exception $e) {
  throw new QueryException();
}

if (!$user) {
  throw new NotFoundException("User not found");
}

$activeTitle = $titleService->getUserActiveTitle($userAuthId);
$user["title"] = $activeTitle ? $activeTitle["id"] : NULL;
$titles = $titleService->getUserTitlesList($userAuthId, 1);

Response::json([
  "ok" => TRUE,
  "profile" => $user,
  "titles" => $titles
]);
