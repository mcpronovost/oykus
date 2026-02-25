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

    // Replied To
    if (array_key_exists("replied_id", $data)) {
      $replied_id = (int) $data["replied_id"];
      if ($replied_id <= 0) {
        throw new ValidationException("Replied To value is invalid");
      }
      $fields["replied_id"] = $replied_id;
    }

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

  public function validateCreateData(array $data): array {
    $data = $this->validateData($data);

    if (!isset($data["content"])) {
      throw new ValidationException("Missing Content");
    }

    return [
      "content" => $data["content"],
      "replied_id" => $data["replied_id"] ?? NULL,
    ];
  }

  public function getCommentsForPost(int $postId, int $userId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT
          bpc.id,
          bpc.author_id,
          bpc.content,
          bpc.created_at,
          bpc.updated_at,

          JSON_OBJECT(
            'id', au.id,
            'name', au.name,
            'slug', au.slug,
            'abbr', au.abbr,
            'avatar', au.avatar
          ) AS author,

          SUM(CASE WHEN br.reaction = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN br.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
          MAX(ur.reaction) AS user,

          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', bc2.id,
                'replied_id', bc2.replied_id,
                'content', bc2.content,
                'author', JSON_OBJECT(
                  'id', au2.id,
                  'name', au2.name,
                  'slug', au2.slug,
                  'abbr', au2.abbr,
                  'avatar', au2.avatar
                ),
                'created_at', bc2.created_at,
                'updated_at', bc2.updated_at
              )
            )
            FROM blog_comments bc2
            LEFT JOIN auth_users au2 ON au2.id = bc2.author_id
            WHERE bc2.replied_id = bpc.id
          ) AS replies

        FROM blog_comments bpc
        LEFT JOIN auth_users au ON au.id = bpc.author_id
        LEFT JOIN blog_reactions br ON br.target_id = bpc.id AND br.target_tag = 'comment'
        LEFT JOIN blog_reactions ur ON ur.target_id = bpc.id AND ur.target_tag = 'comment' AND ur.user_id = ?
        WHERE bpc.post_id = ? AND bpc.replied_id IS NULL
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
          'author'     => $row['author'] ? json_decode($row['author'], TRUE) : NULL,
          'reactions'  => [
            'likes' => (int) $row['likes'],
            'dislikes' => (int) $row['dislikes'],
            'user' => $row['user']
          ],
          'replies'   => $row['replies'] ? json_decode($row['replies'], TRUE) : []
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

  public function createComment(int $universeId, int $postId, int $userId, array $fields): array {
    try {
      $insert = $this->pdo->prepare("
        INSERT INTO blog_comments (universe_id, post_id, author_id, content, replied_id)
        VALUES (?, ?, ?, ?, ?)
      ");
      $insert->execute([$universeId, $postId, $userId, $fields["content"], $fields["replied_id"]]);
    }
    catch (Exception $e) {
      throw new QueryException("Failed to create comment".$e->getMessage());
    }

    return $this->getCommentsForPost($postId, $userId);
  }
}
