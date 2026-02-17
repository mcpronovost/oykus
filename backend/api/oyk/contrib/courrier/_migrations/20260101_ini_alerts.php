<?php
require_once __DIR__ . "/../../../core/db.php";

try {
  $pdo->exec("
    CREATE TABLE IF NOT EXISTS courrier_alerts (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      recipient INT UNSIGNED NULL,

      title VARCHAR(120) NOT NULL,
      tag VARCHAR(64) NOT NULL,

      source_table VARCHAR(64) NULL,
      source_id INT UNSIGNED NULL,

      payload JSON NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,

      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_courrier_alerts_recipient
        FOREIGN KEY (recipient) REFERENCES auth_users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB;
  ");
}
catch (Exception $e) {
  echo $e->getMessage();
}
