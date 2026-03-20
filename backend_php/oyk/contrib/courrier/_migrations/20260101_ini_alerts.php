<?php
require_once __DIR__ . "/../../../core/db.php";

try {
  $pdo->exec("
    CREATE TABLE IF NOT EXISTS courrier_alerts (
      `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      `user_id` int UNSIGNED NULL,

      `title` varchar(120) NOT NULL,
      `tag` varchar(64) NOT NULL,

      `source_table` varchar(64) NULL,
      `source_id` int UNSIGNED NULL,

      `payload` json NULL,
      `is_read` tinyint(1) NOT NULL DEFAULT 0,

      `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_ca_user
        FOREIGN KEY (user_id) REFERENCES auth_users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB;
  ");
}
catch (Exception $e) {
  echo $e->getMessage();
}
