<?php

class FriendService {
  public function __construct(private PDO $pdo) {
  }

  public function getFriendPending(int $userId, int $friendId): ?array {
    try {
      $qry = $this->pdo->prepare("
        SELECT status, responded_at
        FROM social_friends
        WHERE 
        (user_id = :userId AND friend_id = :targetFriendId)
        OR
        (user_id = :targetUserId AND friend_id = :friendId)
        LIMIT 1
    ");
      $qry->execute([
        "userId" => $userId,
        "targetFriendId" => $friendId,
        "targetUserId" => $friendId,
        "friendId" => $userId
      ]);
      $pending = $qry->fetch();
    }
    catch (Exception $e) {
      Response::serverError();
    }

    return $pending ?: NULL;
  }
}
