<?php

class AchievementService {
  protected $pdo;

  public function __construct($pdo) {
    $this->pdo = $pdo;
  }

  public function handleEvent($eventName, $userId) {
    $stmt = $this->pdo->prepare("
            SELECT a.id AS achievement_id, c.target_count
            FROM achievements a
            JOIN achievements_conditions c ON a.id = c.achievement_id
            WHERE c.event_name = ?
        ");
    $stmt->execute([$eventName]);
    $achievements = $stmt->fetchAll();

    foreach ($achievements as $ach) {
      $achievementId = $ach["achievement_id"];
      $targetCount = $ach["target_count"];

      $count = $this->getEventCount($userId, $eventName);

      if ($count >= $targetCount) {
        $this->unlockAchievement($userId, $achievementId);
      }
    }

    $this->incrementEventCount($userId, $eventName);
  }

  protected function getEventCount($userId, $eventName) {
    $stmt = $this->pdo->prepare("
            SELECT count FROM user_event_counts
            WHERE user_id = ? AND event_name = ?
        ");
    $stmt->execute([$userId, $eventName]);
    $row = $stmt->fetch();
    return $row ? $row["count"] : 0;
  }

  protected function incrementEventCount($userId, $eventName) {
    $stmt = $this->pdo->prepare("
            INSERT INTO user_event_counts (user_id, event_name, count)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE count = count + 1
        ");
    $stmt->execute([$userId, $eventName]);
  }

  protected function unlockAchievement($userId, $achievementId) {
    $stmt = $this->pdo->prepare("
            SELECT 1 FROM achievements_user_rewards
            WHERE user_id = ? AND achievement_id = ?
        ");
    $stmt->execute([$userId, $achievementId]);
    if ($stmt->fetch())
      return;

    $stmt = $this->pdo->prepare("
            INSERT INTO achievements_user_rewards (user_id, achievement_id)
            VALUES (?, ?)
        ");
    $stmt->execute([$userId, $achievementId]);
  }
}
