<?php

function earn_achievement ($pdo, $achievementKey, $userId) {
    try {
        $qry = $pdo->prepare("
            INSERT INTO achievements (tag, title, description, category, goal, period)
            VALUES ('first_login', 'Welcome', 'Log in for the first time.', 'general', 1, 'one-time')
            ON DUPLICATE KEY UPDATE tag = 'first_login';
        ");
        $qry->execute();

        $achievementId = (int) $pdo->lastInsertId();

        if ($achievementId === 0) {
            $qry = $pdo->prepare("
                SELECT id FROM achievements WHERE tag = 'first_login' LIMIT 1
            ");
            $qry->execute();
            $achievementId = (int) $qry->fetchColumn();
        }

        $qry = $pdo->prepare("
            INSERT IGNORE INTO achievements_users (achievement_id, user_id, unlocked_at, progress)
            VALUES (:achievementId, :userId, :unlockedAt, :progress);
        ");
        $qry->execute([
            "achievementId" => $achievementId,
            "userId"        => $userId,
            "unlockedAt"    => date("Y-m-d H:i:s"),
            "progress"      => 1
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
        exit;
    }

    return;
};
