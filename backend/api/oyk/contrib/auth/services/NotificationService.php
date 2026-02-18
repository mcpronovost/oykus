<?php

class NotificationService {
  public function __construct(private PDO $pdo) {
  }

  public function getNotifications(int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT title, tag, payload
        FROM courrier_alerts
        WHERE recipient = :id AND is_read = 0
        ORDER BY created_at DESC
      ");

      $qry->execute([$userId]);
      $alerts = $qry->fetchAll();

      foreach ($alerts as &$a) {
        $a["payload"] = json_decode($a["payload"]);
      }
    }
    catch (Exception $e) {
      Response::serverError();
    }

    try {
      $qry = $this->pdo->prepare("
        SELECT COUNT(*)
        FROM auth_friends
        WHERE friend_id = :id AND status = 'pending'
      ");

      $qry->execute([$userId]);
      $friends = $qry->fetchColumn();
    }
    catch (Exception $e) {
      Response::serverError();
    }

    return [
      "alerts" => $alerts,
      "friends" => $friends,
      "messages" => 0,
    ];
  }
}
