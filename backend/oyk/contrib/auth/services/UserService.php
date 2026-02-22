<?php

class UserService {
  public function __construct(private PDO $pdo) {
  }

  private function userCanAuth(int $userId): bool {
    try {
      $qry = $this->pdo->prepare("
        SELECT is_banned, banned_until, locked_until
        FROM auth_users
        WHERE id = ? AND is_active = 1
        LIMIT 1
      ");

      $qry->execute([$userId]);
      $user = $qry->fetch();
    }
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    if (!$user) {
      Response::notFound("User not found");
    }

    $now = new DateTime();

    // Check if banned
    if ($user["is_banned"]) {
      if ($user["banned_until"] !== NULL && new DateTime($user["banned_until"]) < $now) {
        // unban_user($user["id"]);
      }
      else {
        Response::forbidden("Banned");
      }
    }

    // Check if locked
    if ($user["locked_until"] !== NULL && new DateTime($user["locked_until"]) > $now) {
      Response::locked();
    }

    return TRUE;
  }

  public function getCurrentUser(int $userId): array {
    $this->userCanAuth($userId);

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
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    return $user ?: NULL;
  }
}
