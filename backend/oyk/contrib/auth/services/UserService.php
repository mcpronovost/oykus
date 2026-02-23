<?php

class UserService {
  public function __construct(private PDO $pdo) {
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
