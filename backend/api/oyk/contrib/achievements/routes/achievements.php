<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

try {
    $stmt = $pdo->prepare("
        INSERT INTO achievements (id, achievement_key, title, description, category, goal, period)
        VALUES (1, 'first_login', 'Welcome', 'Log in for the first time.', 'general', 1, 'one-time')
        ON DUPLICATE KEY UPDATE period = 'one-time';
    ");
    $stmt->execute();
    $stmt = $pdo->prepare("
        INSERT INTO achievements (id, achievement_key, title, description, category, goal, period)
        VALUES (2, 'first_collectible', 'My First Shiny', 'Earn your first collectible.', 'collectibles', 1, 'one-time')
        ON DUPLICATE KEY UPDATE category = 'collectibles';
    ");
    $stmt->execute();
    $stmt = $pdo->prepare("
        INSERT INTO achievements (id, achievement_key, title, description, category, goal, period)
        VALUES (3, 'three_new_collectibles', 'Always More', 'Earn three more collectible in the same week.', 'collectibles', 3, 'weekly')
        ON DUPLICATE KEY UPDATE category = 'collectibles';
    ");
    $stmt->execute();
    $stmt = $pdo->prepare("
        INSERT INTO achievements_users (id, user_id, achievement_id, unlocked_at, progress)
        VALUES (1, 2, 1, '2026-01-01', 1)
        ON DUPLICATE KEY UPDATE progress = 1;
    ");
    $stmt->execute();
    $stmt = $pdo->prepare("
        INSERT INTO achievements_users (id, user_id, achievement_id, unlocked_at, progress)
        VALUES (2, 2, 2, '2026-01-03', 1)
        ON DUPLICATE KEY UPDATE achievement_id = 2;
    ");
    $stmt->execute();
    $stmt = $pdo->prepare("
        INSERT INTO achievements_users (id, user_id, achievement_id, unlocked_at, progress)
        VALUES (3, 2, 3, '2026-01-04', 1)
        ON DUPLICATE KEY UPDATE achievement_id = 3;
    ");
    $stmt->execute();

    $qry = $pdo->prepare("
        SELECT
            a.id,
            a.achievement_key,
            a.title,
            a.description,
            a.category,
            a.goal,
            a.period,

            COALESCE(au.progress, 0) AS progress,
            au.unlocked_at
        FROM achievements a
        LEFT JOIN achievements_users au
            ON au.achievement_id = a.id
        AND au.user_id = ?
        ORDER BY
            au.updated_at DESC,
            au.unlocked_at DESC,
            a.category,
            a.id
        LIMIT 12;
    ");
    $qry->execute([$authUser["id"]]);

    $result = [];
    $categories = [];

    while ($row = $qry->fetch()) {
        // $result[$row["category"]][] = [ // GROUP BY TYPE
        $result[] = [
            "key"           => $row["achievement_key"],
            "title"         => $row["title"],
            "description"   => $row["description"],
            "category"          => $row["category"],
            "progress"      => (int) $row["progress"],
            "goal"          => (int) $row["goal"],
            "period"        => $row["period"],
            "is_unlocked"   => $row["unlocked_at"] !== null,
            "is_completed"  => (int) $row["goal"] === (int) $row["progress"]
        ];
        $category = $row["category"];
        $categories[$category] = ($categories[$category] ?? 0) + 1;
    }

    echo json_encode([
        "ok"            => true,
        "achievements"  => $result,
        "categories"         => $categories
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getCode(), "message" => $e->getMessage()]);
    exit;
}