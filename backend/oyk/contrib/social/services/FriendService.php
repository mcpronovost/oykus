<?php

class FriendService {
  public function __construct(private PDO $pdo) {
  }

  public function getFriendsList(int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT u.name, u.abbr, u.slug, u.avatar, u.cover, rt.name AS title
        FROM social_friends f
        JOIN auth_users u ON u.id = f.friend_id
        LEFT JOIN reward_titles_users rut ON rut.user_id = u.id AND rut.is_active = 1
        LEFT JOIN reward_titles rt ON rt.id = rut.title_id
        WHERE f.user_id = ?
            AND f.status = 'accepted'
        ORDER BY u.name ASC;
      ");

      $qry->execute([$userId]);
      $friends = $qry->fetchAll();
    }
    catch (Exception) {
      throw new QueryException("Failed to get friends list");
    }

    return $friends ?: [];
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
