<?php

class Response {

  public static function json($data, int $status = 200, array $headers = []) {
    http_response_code($status);

    header("Content-Type: application/json; charset=utf-8");

    foreach ($headers as $key => $value) {
      header("$key: $value");
    }

    echo json_encode($data);
    exit;
  }

  public static function noContent() {
    http_response_code(204);
    exit;
  }

  public static function error(string $message, int $status = 400, array $extra = []) {
    $payload = array_merge([
      "ok" => FALSE,
      "error" => $message
    ], $extra);

    error_log(">> ".print_r($message, TRUE));

    self::json($payload, $status);
  }

  public static function badRequest(string $message = "Bad request", array $extra = []) {
    self::error($message, 400, $extra);
  }

  public static function unauthorized(string $message = "Unauthorized", array $extra = []) {
    self::error($message, 401, $extra);
  }

  public static function forbidden(string $message = "Forbidden", array $extra = []) {
    self::error($message, 403, $extra);
  }

  public static function notFound(string $message = "Not found", array $extra = []) {
    self::error($message, 404, $extra);
  }

  public static function conflict(string $message = "Conflict", array $extra = []) {
    self::error($message, 409, $extra);
  }

  public static function locked(string $message = "Locked", array $extra = []) {
    self::error($message, 423, $extra);
  }

  public static function serverError(string $message = "Server error", array $extra = []) {
    self::error($message, 500, $extra);
  }
}
