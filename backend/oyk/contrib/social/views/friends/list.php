<?php

global $pdo;
$authUserId = require_rat();

$friendService = new FriendService($pdo);

$friends = $friendService->getFriendsList($authUserId);

Response::json([
  "ok" => TRUE,
  "friends" => $friends
]);
