<?php
global $pdo;

$pdo->exec("
    CREATE INDEX idx_user ON reward_titles_users(user_id);
    CREATE INDEX idx_title ON reward_titles_users(title_id);
    CREATE INDEX idx_user_active ON reward_titles_users(user_id, is_active);
    CREATE UNIQUE INDEX uniq_user_title ON reward_titles_users(user_id, title_id);
");