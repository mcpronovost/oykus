<?php

class BlogService {

  public function __construct(private PDO $pdo) {
  }

  public function getPosts(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT id, author, title, description, content, created_at, updated_at
        FROM blog_posts
        WHERE universe = ?
        ORDER BY created_at DESC
      ");

      $qry->execute([
        $universeId
      ]);

      return $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Failed to get posts");
    }
  }

  public function getPost(int $universeId, int $postId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT bp.id, bp.author, bp.title, bp.description, bp.content, bp.created_at, bp.updated_at,
          SUM(CASE WHEN br.reaction = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN br.reaction = 'dislike' THEN 1 ELSE 0 END) AS dislikes
        FROM blog_posts bp
        LEFT JOIN blog_reactions br ON bp.id = br.post
        WHERE bp.universe = ? AND bp.id = ?
        GROUP BY bp.id
        LIMIT 1
      ");

      $qry->execute([
        $universeId,
        $postId
      ]);

      return $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Failed to get post");
    }
  }
}
