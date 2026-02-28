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

    return $users ?: NULL;
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
}
