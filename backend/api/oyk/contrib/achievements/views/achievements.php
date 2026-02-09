<?php

global $pdo;
$authUser = require_auth();

$result = [];
$categories = [];

try {
  $qry = $pdo->prepare("
    SELECT
        a.id,
        a.tag,
        a.title,
        a.description,
        a.category,
        a.goal,
        a.period,

        COALESCE(au.progress, 0) AS progress,
        au.unlocked_at,
        au.reset_at
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

  while ($row = $qry->fetch()) {
    // $result[$row["category"]][] = [ // GROUP BY TYPE
    $result[] = [
      "tag" => $row["tag"],
      "title" => $row["title"],
      "description" => $row["description"],
      "category" => $row["category"],
      "progress" => (int) $row["progress"],
      "goal" => (int) $row["goal"],
      "period" => $row["period"],
      "reset_at" => $row["reset_at"],
      "is_unlocked" => $row["unlocked_at"] !== NULL,
      "is_completed" => (int) $row["goal"] === (int) $row["progress"]
    ];
    $category = $row["category"];
    $categories[$category] = ($categories[$category] ?? 0) + 1;
  }
}
catch (Exception $e) {
  Response::serverError();
}

Response::json([
  "ok" => TRUE,
  "achievements" => $result,
  "categories" => $categories
]);
