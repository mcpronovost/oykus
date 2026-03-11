<?php

class UserService {
  public function __construct(private PDO $pdo) {
  }

  public function getCommunity(): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT au.id,
               au.name,
               au.slug,
               au.abbr,
               au.avatar,
               au.cover,
               (au.lastlive_at >= NOW() - INTERVAL 5 MINUTE) AS is_online
        FROM auth_users au
        WHERE au.is_active = 1
        ORDER BY au.lastlive_at IS NULL,
                 au.lastlive_at DESC
      ");
      $qry->execute();
      $users = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Users community retrieval failed");
    }

    return $users ?: [];
  }

  public function getCurrentUser(int $userId): array {
    oykAuthService()->userCanAuth($userId);

    try {
      $qry = $this->pdo->prepare("
        SELECT id, name, slug, abbr, avatar, cover, is_dev, timezone
        FROM auth_users
        WHERE id = ?
        LIMIT 1
      ");

      $qry->execute([$userId]);
      $user = $qry->fetch();

      if (!$user) {
        Response::notFound("User not found");
      }

      if (!$user["is_dev"]) {
        unset($user["is_dev"]);
      }
    }
    catch (Exception) {
      Response::serverError();
    }

    return $user ?: NULL;
  }

  public function getUserActivities(string $userSlug, int $offset = 0): array {
    $activities = [];

    try {
      $qry = $this->pdo->prepare("
        SELECT 
            au.id,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', x.id,
                        'type', x.type,
                        'content', x.content,
                        'created_at', x.created_at,
                        'updated_at', x.updated_at
                    )
                )
                FROM (
                    SELECT *
                    FROM (
                        SELECT 
                            bp.id,
                            'post' AS type,
                            bp.content,
                            bp.created_at,
                            bp.updated_at
                        FROM blog_posts bp
                        WHERE bp.author_id = au.id

                        UNION ALL

                        SELECT 
                            bc.id,
                            'comment' AS type,
                            bc.content,
                            bc.created_at,
                            bc.updated_at
                        FROM blog_comments bc
                        WHERE bc.author_id = au.id
                    ) AS merged
                    ORDER BY merged.created_at DESC
                    LIMIT 5 OFFSET ?
                ) AS x
            ) AS activities
        FROM auth_users au
        WHERE au.slug = ?
        LIMIT 1;
      ");

      $qry->execute([$offset, $userSlug]);
      $user = $qry->fetch();
    }
    catch (Exception) {
      throw new QueryException("User activities retrieval failed");
    }

    if (!$user) {
      throw new NotFoundException();
    }

    if (!empty($user["activities"])) {
      $activities = json_decode($user["activities"], TRUE);
    }

    return $activities;
  }
}
