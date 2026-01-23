<?php

function earn_achievement ($pdo, $achievementKey, $userId) {
    try {
        $qry = $pdo->prepare("
            SELECT id FROM achievements
            WHERE achievement_key = :key
            LIMIT 1;
        ");
        $qry->execute([ "key" => $achievementKey]);
        $achievement = $qry->fetch();

        if (!$achievement) {
            $stmt = $pdo->prepare("
                INSERT INTO achievements (id, achievement_key, title, description, category, goal, period)
                VALUES (1, 'first_login', 'Welcome', 'Log in for the first time.', 'general', 1, 'one-time')';
            ");
            $stmt->execute();
            $achievement = $stmt->fetch();
        };

        $qry = $pdo->prepare("
            INSERT IGNORE INTO achievements_users (achievement_id, user_id, unlocked_at, progress)
            VALUES (:achievementId, :userId, :unlockedAt, :progress);
        ");
        $qry->execute([
            "achievementId" => $achievement["id"],
            "userId"        => $userId,
            "unlockedAt"    => date("Y-m-d H:i:s"),
            "progress"      => 1
        ]);
    } catch (Exception $e) {
        return;
    }

    return;
};
