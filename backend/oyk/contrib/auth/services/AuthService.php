<?php

class AuthService {
  public function __construct(private PDO $pdo) {
  }

  public function userCanAuth(int $userId): bool {
    try {
      $qry = $this->pdo->prepare("
        SELECT is_banned, banned_until, banned_reason, locked_until
        FROM auth_users
        WHERE id = ? AND is_active = 1
        LIMIT 1
      ");

      $qry->execute([$userId]);
      $user = $qry->fetch();
    }
    catch (Exception) {
      Response::serverError();
    }

    if (!$user) {
      Response::notFound("User not found");
    }

    $now = new DateTime();

    // Check if banned
    if ($user["is_banned"]) {
      if ($user["banned_until"] !== NULL && new DateTime($user["banned_until"]) < $now) {
        $this->handleUserUnban($userId);
      }
      else {
        Response::forbidden("Banned", ["until" => $user["banned_until"], "reason" => $user["banned_reason"]]);
      }
    }

    // Check if locked
    if ($user["locked_until"] !== NULL) {
      if (new DateTime($user["locked_until"]) < $now) {
        $this->handleUserUnlock($userId);
      } else {
        Response::locked("Locked", ["until" => $user["locked_until"]]);
      }
    }

    return TRUE;
  }

  public function validateData(array $data): array {
    $fields = [];

    // Username
    if (array_key_exists("username", $data)) {
      $username = trim($data["username"]);
      if ($username === "") {
        Response::badRequest("Username cannot be empty");
      }
      $fields["username"] = $username;
    }

    // Password
    if (array_key_exists("password", $data)) {
      $password = trim($data["password"]);
      if ($password === "") {
        Response::badRequest("Password cannot be empty");
      }
      $fields["password"] = $password;
    }

    return $fields;
  }

  private function updateFailedLogin(int $userId, int $userFailedLoginCount): void {
    try {
      $qry = $this->pdo->prepare("
        UPDATE auth_users
        SET failedlogin_at = NOW(),
            failedlogin_count = failedlogin_count + 1,
            locked_until = CASE
              WHEN failedlogin_count >= 20 THEN DATE_ADD(NOW(), INTERVAL 60 MINUTE)
              WHEN failedlogin_count >= 15 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
              WHEN failedlogin_count >= 10 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
              WHEN failedlogin_count >= 5 THEN DATE_ADD(NOW(), INTERVAL 5 MINUTE)
              ELSE locked_until
            END
        WHERE id = ?
      ");
      $qry->execute([$userId]);
    }
    catch (Exception) {
      Response::serverError();
    }

    $userFailedLoginCount += 1;

    if ($userFailedLoginCount >= 5) {
      oykSecurityLogService()->logLockedUser($userId, $userFailedLoginCount);
    }
    
    $this->userCanAuth($userId);
  }

  private function updateSuccessLogin(int $userId, string $ip): void {
    try {
      $qry = $this->pdo->prepare("
        UPDATE auth_users
        SET failedlogin_at = NULL,
            failedlogin_count = 0,
            lastlogin_at = NOW(),
            lastlogin_ip = ?
        WHERE id = ?
      ");
      $qry->execute([$ip, $userId]);
    }
    catch (Exception) {
      Response::serverError();
    }
  }

  public function handleFailedLogin(array $user, string $password): void {
    $this->userCanAuth($user["id"]);

    if (!password_verify($password, $user["password"])) {
      $this->updateFailedLogin($user["id"], $user["failedlogin_count"]);

      Response::badRequest("Invalid credentials");
    }
  }

  public function handleSuccessLogin(array $user): void {
    $ip = $_SERVER["REMOTE_ADDR"] ?? null;

    if ($user["lastlogin_ip"] !== NULL && $user["lastlogin_ip"] !== $ip) {
      oykSecurityLogService()->logSuspiciousIp($user["id"], $user["lastlogin_ip"], $ip);
    }

    $this->updateSuccessLogin($user["id"], $ip);
  }

  public function handleUserUnban(int $userId): void {
    try {
      $qry = $this->pdo->prepare("
        UPDATE auth_users
        SET is_banned = 0, banned_until = NULL, banned_reason = NULL
        WHERE id = ?
      ");
      $qry->execute([$userId]);
    }
    catch (Exception) {
      Response::serverError();
    }
  }

  public function handleUserUnlock(int $userId): void {
    try {
      $qry = $this->pdo->prepare("
        UPDATE auth_users
        SET locked_until = NULL
        WHERE id = ?
      ");
      $qry->execute([$userId]);
    }
    catch (Exception) {
      Response::serverError();
    }
  }

  public function getLoginUser(string $username): array {
    try {
      $stmt = $this->pdo->prepare("
        SELECT id, username, password, failedlogin_count, lastlogin_ip
        FROM auth_users
        WHERE username = ? AND is_active = 1
        LIMIT 1
      ");
      $stmt->execute([$username]);
      $authUser = $stmt->fetch();
    }
    catch (Exception) {
      Response::serverError();
    }

    if (!$authUser) {
      Response::notFound("User not found");
    }

    return $authUser;
  }

  public function getRat(int $userId, bool $isGenereteRefresh): ?string {
    $isProd = getenv("HTTP_ISPROD");

    try {
      // Access token (15 mins)
      $accessToken = generate_jwt([
        "id" => $userId,
        "exp" => time() + 900
      ]);

      if ($isGenereteRefresh) {
         // Refresh token (30 days)
        $refreshToken = generate_jwt([
          "id" => $userId,
          "jti" => bin2hex(random_bytes(16)),
          "exp" => time() + 60 * 60 * 24 * 30
        ]);

        setcookie(
          "oyk-rat",
          $refreshToken,
          [
            "expires" => time() + 60 * 60 * 24 * 30,
            "path" => "/",
            "secure" => $isProd,
            "httponly" => TRUE,
            "samesite" => $isProd ? "Lax" : "None",
          ]
        );
      }
    }
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    return $accessToken ?: NULL;
  }
}
