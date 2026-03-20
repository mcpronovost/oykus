<?php

global $pdo;
$userId = require_rat();

$friendService = new FriendService($pdo);

$friends = $friendService->getFriendsList($userId);

Response::json([
  "ok" => TRUE,
  "friends" => $friends
]);
