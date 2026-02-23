<?php

class NotificationService {
  public function __construct(private PDO $pdo) {
  }

  public function getNotificationsCounts(int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT COUNT(*)
        FROM courrier_alerts
        WHERE recipient = :id AND is_read = 0
      ");

      $qry->execute([$userId]);
      $alerts = $qry->fetchColumn();
    }
    catch (Exception $e) {
      throw new QueryException("Alerts retrieval failed");
    }

    try {
      $qry = $this->pdo->prepare("
        SELECT COUNT(*)
        FROM social_friends
        WHERE friend_id = :id AND status = 'pending'
      ");

      $qry->execute([$userId]);
      $friends = $qry->fetchColumn();
    }
    catch (Exception) {
      throw new QueryException("Friends retrieval failed");
    }

    return [
      "alerts" => $alerts,
      "friends" => $friends,
      "messages" => 0,
    ];
  }
}
