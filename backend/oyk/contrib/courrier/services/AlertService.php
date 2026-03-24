<?php

class AlertService {

  public function __construct(private PDO $pdo) {
  }

  public function createAlert(int $userId, string $title, string $tag, string $source_table, int $source_id, array $payload): void {
    try {
      $qry = $this->pdo->prepare("
        INSERT INTO courrier_alerts (user_id, title, tag, source_table, source_id, payload)
        VALUES (?, ?, ?, ?, ?, ?)
      ");

      $qry->execute([
        $userId,
        $title,
        $tag,
        $source_table,
        $source_id,
        json_encode($payload)
      ]);

      return;
    }
    catch (Exception $e) {
      throw new QueryException("Failed to create alert");
    }
  }

  public function getAlertsList(int $userId, int $offset = 0, ?bool $isUnread = null, ?string $hasTag = null): array {
    try {
      $conditions = ["ca.user_id = ?"];
      $params = [$userId];

      if ($isUnread === true) {
          $conditions[] = "ca.is_read = 0";
      }

      if ($hasTag !== null) {
          $conditions[] = "ca.tag = ?";
          $params[] = $hasTag;
      }

      $where = implode(" AND ", $conditions);
      $params[] = $offset;

      error_log(print_r($where, TRUE));
      error_log(print_r($params, TRUE));

      $qry = $this->pdo->prepare("SELECT
          ca.id,
          ca.title,
          ca.tag,
          ca.payload,
          ca.is_read,
          ca.created_at
        FROM courrier_alerts ca
        WHERE {$where}
        ORDER BY ca.created_at DESC
        LIMIT 5 OFFSET ?
      ");
      $qry->execute($params);
      $alerts = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Alerts retrieval failed".$e->getMessage());
    }

    foreach ($alerts as &$a) {
      $a["payload"] = json_decode($a["payload"], TRUE);
    }
    unset($a);
    
    return $alerts;
  }

  public function getUnreadAlertsCount(int $userId): int {
    try {
      $qry = $this->pdo->prepare("
        SELECT COUNT(*)
        FROM courrier_alerts
        WHERE user_id = :id AND is_read = 0
      ");

      $qry->execute([$userId]);
      $alerts = $qry->fetchColumn();
    }
    catch (Exception $e) {
      throw new QueryException("Alerts count retrieval failed");
    }

    return (int) ($alerts ?? 0);
  }

  public function markAsRead(int $userId, int $alertId): void {
    try {
      $qry = $this->pdo->prepare("
        UPDATE courrier_alerts
        SET is_read = 1
        WHERE id = ? AND user_id = ?
      ");
      $qry->execute([$alertId, $userId]);
  
      if ($qry->rowCount() === 0) {
        throw new NotFoundException("Alert not found");
      }
    }
    catch (NotFoundException $e) {
      throw $e;
    }
    catch (Exception $e) {
      throw new QueryException("Failed to mark alert as read");
    }
  }
}
