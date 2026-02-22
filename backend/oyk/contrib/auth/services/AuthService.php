<?php

class AuthService {
  public function __construct(private PDO $pdo) {
  }

  public function getRat(int $userId, string $userUsername, bool $isProd): string {
    try {
      // Access token (15 mins)
      $accessToken = generate_jwt([
        "id" => $userId,
        "username" => $userUsername,
        "exp" => time() + 900
      ]);

      // Refresh token (30 days)
      $refreshToken = generate_jwt([
        "id" => $userId,
        "username" => $userUsername,
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
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    return $accessToken ?: NULL;
  }
}
