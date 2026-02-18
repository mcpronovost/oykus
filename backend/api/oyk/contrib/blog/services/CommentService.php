<?php

/**
 * Blog comments service
 */
class CommentService {

  public function __construct(private PDO $pdo) {
  }

  public function userCanAddComment(int $universeId, int $postId, int $userId): bool {
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

    // Content
    if (array_key_exists("content", $data)) {
      $content = trim($data["content"]);
      if ($content === "") {
        throw new ValidationException("Content value is invalid");
      }
      $fields["content"] = $content;
    }

    return $fields;
  }

  public function getCommentsForPost(int $postId, int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT bpc.id, bpc.author, bpc.content, bpc.created_at, bpc.updated_at,
          JSON_OBJECT(
            'id', au.id,
            'name', au.name,
            'slug', au.slug,
            'abbr', au.abbr,
            'avatar', au.avatar
          ) AS author,
          SUM(CASE WHEN br.reaction = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN br.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
          MAX(ur.reaction) AS user
        FROM blog_comments bpc
        LEFT JOIN auth_users au ON au.id = bpc.author
        LEFT JOIN blog_comment_reactions br ON br.comment = bpc.id
        LEFT JOIN blog_comment_reactions ur ON ur.comment = bpc.id AND ur.user = ?
        WHERE bpc.post = ?
        GROUP BY bpc.id
        ORDER BY bpc.created_at DESC
        LIMIT 12
      ");

      $qry->execute([
        $userId,
        $postId
      ]);

      $rows = $qry->fetchAll();

      $comments = array_map(function ($row) {
        return [
          'id'         => $row['id'],
          'content'    => $row['content'],
          'created_at' => $row['created_at'],
          'updated_at' => $row['updated_at'],
          'author'     => json_decode($row['author'], TRUE),
          'reactions'  => [
            'likes' => (int) $row['likes'],
            'dislikes' => (int) $row['dislikes'],
            'user' => $row['user']
          ]
        ];
      }, $rows);

      return $comments;
    }
    catch (Exception $e) {
      throw new QueryException("Failed to get comments" . $e->getMessage());
    }
  }

  public function getCommentsCountForPost(int $postId): int {
    try {
      $qry = $this->pdo->prepare("
        SELECT COUNT(*)
        FROM blog_comments
        WHERE post = ?
      ");

      $qry->execute([
        $postId
      ]);

      return (int) $qry->fetchColumn();
    }
    catch (Exception $e) {
      throw new QueryException("Failed to get comments");
    }
  }

  public function createComment(int $postId, int $userId, array $fields): array {
    try {
      $insert = $this->pdo->prepare("
        INSERT INTO blog_comments (post, author, content)
        VALUES (?, ?, ?)
      ");
      $insert->execute([$postId, $userId, $fields["content"]]);
    }
    catch (Exception $e) {
      throw new QueryException("Failed to create comment");
    }

    return $this->getCommentsForPost($postId, $userId);
  }
}
