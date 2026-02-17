<?php

class BlogService {

  public function __construct(private PDO $pdo) {
  }

  public function userCanCreatePost(int $universeId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes u
        WHERE u.id = ? AND u.owner = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function userCanEditPost(int $universeId, int $postId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$postId || $postId <= 0) {
      throw new NotFoundException("Post not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes u
        WHERE u.id = ? AND u.owner = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function userCanDeletePost(int $universeId, int $postId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$postId || $postId <= 0) {
      throw new NotFoundException("Post not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes u
        WHERE u.id = ? AND u.owner = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function validateData(array $data): array {
    $fields = [];

    // Title
    if (array_key_exists("title", $data)) {
      $title = trim($data["title"]);
      if ($title === "") {
        throw new ValidationException("Title cannot be empty");
      }
      $fields["title"] = substr($title, 0, 120);
    }

    // Description
    if (array_key_exists("description", $data)) {
      $description = trim($data["description"]);
      $fields["description"] = substr($description, 0, 120);
    }

    // Content
    if (array_key_exists("content", $data)) {
      $content = trim($data["content"]);
      if ($content === "") {
        throw new ValidationException("Content cannot be empty");
      }
      $fields["content"] = $content;
    }

    return $fields;
  }

  public function validateCreateData(array $data): array {
    $data = $this->validateData($data);

    if (!isset($data["title"])) {
      throw new ValidationException("Missing title");
    }

    if (!isset($data["content"])) {
      throw new ValidationException("Missing content");
    }

    return [
      "title" => $data["title"],
      "description" => $data["description"] ?? NULL,
      "content" => $data["content"],
    ];
  }

  public function getPostsList(int $universeId): array {
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
        SELECT bp.id, bp.author, bp.title, bp.description, bp.content, bp.created_at, bp.updated_at
        FROM blog_posts bp
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

  public function getPostAuthor(int $universeId, int $postId): int {
    try {
      $qry = $this->pdo->prepare("
        SELECT bp.author
        FROM blog_posts bp
        WHERE bp.universe = ? AND bp.id = ?
        LIMIT 1
      ");

      $qry->execute([
        $universeId,
        $postId
      ]);

      $row = $qry->fetch();
      if (!$row) {
        throw new NotFoundException("Post not found");
      }

      return $row["author"];
    }
    catch (Exception $e) {
      throw new QueryException("Failed to get post");
    }
  }

  public function createPost(int $universeId, int $authorId, array $fields): int {
    try {
      $qry = $this->pdo->prepare("
        INSERT INTO blog_posts (universe, author, title, description, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      ");

      $qry->execute([
        $universeId,
        $authorId,
        $fields["title"],
        $fields["description"],
        $fields["content"]
      ]);

      return (int) $this->pdo->lastInsertId();
    }
    catch (Exception $e) {
      throw new QueryException("Failed to create post");
    }
  }

  public function updatePost(int $postId, int $universeId, array $fields): bool {
    try {
      $qry = $this->pdo->prepare("
        UPDATE blog_posts
        SET title = ?, description = ?, content = ?, updated_at = NOW()
        WHERE id = ? AND universe = ?
      ");

      return $qry->execute([
        $fields["title"],
        $fields["description"],
        $fields["content"],
        $postId,
        $universeId
      ]);
    }
    catch (Exception $e) {
      throw new QueryException("Failed to update post");
    }
  }

  public function deletePost(int $postId): void {
    try {
      $qry = $this->pdo->prepare("
        DELETE FROM blog_posts
        WHERE id = ?
      ");
      $qry->execute([$postId]);
    }
    catch (Exception $e) {
      throw new QueryException("Post deletion failed");
    }
  }
}
