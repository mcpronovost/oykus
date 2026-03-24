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

  public function getAlertsList(int $userId, int $offset = 0): array {
    try {
      $qry = $this->pdo->prepare("SELECT
          ca.title,
          ca.tag,
          ca.payload,
          ca.is_read,
          ca.created_at
        FROM courrier_alerts ca
        WHERE ca.user_id = ?
        ORDER BY ca.created_at DESC
        LIMIT 5 OFFSET ?
      ");
      $qry->execute([$userId, $offset]);
      $alerts = $qry->fetchAll();
    }
    catch (Exception) {
      throw new QueryException("Alerts retrieval failed");
    }

    foreach ($alerts as &$a) {
      $a["payload"] = json_decode($a["payload"], TRUE);
    }
    unset($a);
    
    return $alerts;
  }
}
