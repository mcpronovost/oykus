<?php

class AlertService {

  public function __construct(private PDO $pdo) {
  }

  public function createAlert(int $recipientId, string $title, string $tag, string $source_table, int $source_id, array $payload): void {
    try {
      $qry = $this->pdo->prepare("
        INSERT INTO courrier_alerts (recipient, title, tag, source_table, source_id, payload)
        VALUES (?, ?, ?, ?, ?, ?)
      ");

      $qry->execute([
        $recipientId,
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
}
