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

  public function userCanAddReaction(int $universeId, int $postId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$postId || $postId <= 0) {
      throw new NotFoundException("Post not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    return (bool) TRUE;
  }

  public function validateData(array $data): array {
    $fields = [];

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

  public function getReactionsForPost(int $postId, int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT
          SUM(CASE WHEN br.reaction = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN br.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
          MAX(ur.reaction) AS user
        FROM blog_post_reactions br
        LEFT JOIN blog_post_reactions ur ON ur.post = br.post AND ur.user = ?
        WHERE br.post = ?
        GROUP BY br.post
      ");

      $qry->execute([
        $userId,
        $postId
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
      throw new QueryException("Failed to get reactions");
    }
  }

  public function setReaction(int $postId, int $userId, string $reaction): array {
    try {
      // 1. 
      $qry = $this->pdo->prepare("
        SELECT reaction 
        FROM blog_post_reactions 
        WHERE post = ? AND user = ?
      ");
      $qry->execute([$postId, $userId]);
      $existing = $qry->fetchColumn();

      // 2. Aucune réaction → INSERT
      if ($existing === FALSE) {
        $insert = $this->pdo->prepare("
          INSERT INTO blog_post_reactions (post, user, reaction)
          VALUES (?, ?, ?)
        ");
        $insert->execute([$postId, $userId, $reaction]);
      }

      // 3. Même réaction → DELETE (toggle off)
      else if ($existing === $reaction) {
        $delete = $this->pdo->prepare("
          DELETE FROM blog_post_reactions
          WHERE post = ? AND user = ?
        ");
        $delete->execute([$postId, $userId]);
      }

      // 4. Réaction différente → UPDATE
      else {
        $update = $this->pdo->prepare("
          UPDATE blog_post_reactions
          SET reaction = ?
          WHERE post = ? AND user = ?
        ");
        $update->execute([$reaction, $postId, $userId]);
      }
    }
    catch (Exception $e) {
      throw new QueryException("Failed to set reaction");
    }

    return $this->getReactionsForPost($postId, $userId);
  }
}
