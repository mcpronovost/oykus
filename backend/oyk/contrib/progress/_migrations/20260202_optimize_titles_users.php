<?php
global $pdo;

$pdo->exec("
    CREATE INDEX idx_user ON progress_titles_users(user_id);
    CREATE INDEX idx_title ON progress_titles_users(title_id);
    CREATE INDEX idx_user_active ON progress_titles_users(user_id, is_active);
    CREATE UNIQUE INDEX uniq_user_title ON progress_titles_users(user_id, title_id);
");