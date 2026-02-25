<?php

/**
 * Blog reactions service
 * 
 * - getReactionsForPost
 * - setReaction
 */
class ReactionService {

  public function __construct(private PDO $pdo) {
  }

  public function userCanAddReaction(int $universeId, ?int $commentId, ?int $postId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if ((!$commentId || $commentId <= 0) && (!$postId || $postId <= 0)) {
      throw new NotFoundException("Target not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    return (bool) TRUE;
  }

  public function validateData(array $data): array {
    $fields = [];

    // Target
    if (array_key_exists("target", $data)) {
      $target_tag = trim($data["target"]);
      if ($target_tag !== "blog" && $target_tag !== "post" && $target_tag !== "comment") {
        throw new ValidationException("Target value is invalid");
      }
      $fields["target_tag"] = $target_tag;
    }

    // Action
    if (array_key_exists("action", $data)) {
      $action = trim($data["action"]);
      if ($action !== "like" && $action !== "dislike") {
        throw new ValidationException("Action value is invalid");
      }
      $fields["action"] = $action;
    }

    return $fields;
  }

  public function getReactions(int $userId, string $targetTag, int $targetId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT
          SUM(CASE WHEN br.reaction = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN br.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
          MAX(ur.reaction) AS user
        FROM blog_reactions br
        LEFT JOIN blog_reactions ur ON ur.target_id = br.target_id AND ur.target_tag = ? AND ur.user_id = ?
        WHERE br.target_id = ? AND br.target_tag = ?
        GROUP BY br.target_id
      ");

      $qry->execute([
        $targetTag,
        $userId,
        $targetId,
        $targetTag
      ]);

      $row = $qry->fetch();

      if ($row) {
        $row["likes"] = (int) $row["likes"] ?? 0;
        $row["dislikes"] = (int) $row["dislikes"] ?? 0;
        return $row;
      }

      return [];
    }
    catch (Exception $e) {
      throw new QueryException("Failed to get reactions".$e->getMessage());
    }
  }

  public function setReaction(int $universeId, string $targetTag, int $targetId, int $userId, string $reaction): array {
    try {
      // 1. 
      $qry = $this->pdo->prepare("
        SELECT reaction 
        FROM blog_reactions 
        WHERE universe_id = ? AND target_tag = ? AND target_id = ? AND user_id = ?
      ");
      $qry->execute([$universeId, $targetTag, $targetId, $userId]);
      $existing = $qry->fetchColumn();

      // 2. Aucune réaction → INSERT
      if ($existing === FALSE) {
        $insert = $this->pdo->prepare("
          INSERT INTO blog_reactions (universe_id, target_tag, target_id, user_id, reaction)
          VALUES (?, ?, ?, ?, ?)
        ");
        $insert->execute([$universeId, $targetTag, $targetId, $userId, $reaction]);
      }

      // 3. Même réaction → DELETE (toggle off)
      else if ($existing === $reaction) {
        $delete = $this->pdo->prepare("
          DELETE FROM blog_reactions
          WHERE universe_id = ? AND target_tag = ? AND target_id = ? AND user_id = ?
        ");
        $delete->execute([$universeId, $targetTag, $targetId, $userId]);
      }

      // 4. Réaction différente → UPDATE
      else {
        $update = $this->pdo->prepare("
          UPDATE blog_reactions
          SET reaction = ?
          WHERE universe_id = ? AND target_tag = ? AND target_id = ? AND user_id = ?
        ");
        $update->execute([$reaction, $universeId, $targetTag, $targetId, $userId]);
      }
    }
    catch (Exception $e) {
      throw new QueryException("Failed to set reaction".$e->getMessage());
    }

    return $this->getReactions($userId, $targetTag, $targetId);
  }
}
