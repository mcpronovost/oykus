<?php

class LogService {
  public function __construct(private PDO $pdo) {
  }

  private function addLog(array $data): void {
    $qry = $this->pdo->prepare("
      INSERT INTO security_logs (
        module, tag, user_id, severity, meta
      )
      VALUES (?, ?, ?, ?, ?);
    ");

    $qry->execute([
      $data["module"] ?? NULL,
      $data["tag"],
      $data["user_id"] ?? NULL,
      $data["severity"] ?? "info",
      json_encode($data["meta"] ?: [])
    ]);
  }

  public function logLockedUser(int $userId, int $failCount): void {
    $this->addLog([
      "module" => "auth",
      "tag" => "login.locked_user",
      "user_id" => $userId,
      "severity" => "info",
      "meta" => [
        "failedlogin_count" => $failCount
      ]
    ]);
  }

  public function logSuspiciousIp(int $userId, string $oldIp, string $newIp): void {
    $this->addLog([
      "module" => "auth",
      "tag" => "login.suspicious_ip",
      "user_id" => $userId,
      "severity" => "warning",
      "meta" => [
        "old_ip" => $oldIp,
        "new_ip" => $newIp
      ]
    ]);
  }
}
