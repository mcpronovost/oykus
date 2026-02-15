<?php

define("JWT_SECRET", getenv("HTTP_JWT_SECRET"));
define("JWT_ISSUER", "oykus");
define("JWT_EXPIRATION", 3600 * 24 * 30);

function base64url_encode($data) {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function generate_jwt($payload) {
  $header = [
    "alg" => "HS256",
    "typ" => "JWT"
  ];

  $payload["iss"] = JWT_ISSUER;
  $payload["iat"] = time();

  if (!isset($payload["exp"])) {
    $payload["exp"] = time() + JWT_EXPIRATION;
  }

  $base64Header = base64url_encode(json_encode($header));
  $base64Payload = base64url_encode(json_encode($payload));

  $signature = hash_hmac(
    "sha256",
    "$base64Header.$base64Payload",
    JWT_SECRET,
    TRUE
  );

  $base64Signature = base64url_encode($signature);

  return "$base64Header.$base64Payload.$base64Signature";
}

function decode_jwt($token) {
  $parts = explode(".", $token);
  if (count($parts) !== 3) {
    return NULL;
  }

  [$base64Header, $base64Payload, $base64Signature] = $parts;

  $signatureCheck = hash_hmac(
    "sha256",
    "$base64Header.$base64Payload",
    JWT_SECRET,
    TRUE
  );

  $expectedSignature = rtrim(strtr(
    base64_encode($signatureCheck),
    "+/",
    "-_"
  ), "=");

  if (!hash_equals($expectedSignature, $base64Signature)) {
    return NULL;
  }

  $payload = json_decode(base64_decode(
    strtr($base64Payload, "-_", "+/")
  ), TRUE);

  if (!$payload) {
    return NULL;
  }

  // Expiration
  if (($payload["exp"] ?? 0) < time()) {
    return NULL;
  }

  // Issuer
  if (($payload["iss"] ?? "") !== JWT_ISSUER) {
    return NULL;
  }

  return $payload;
}

function get_guest_id(): string {
  if (!isset($_COOKIE["oyk-gid"])) {
    $token = bin2hex(random_bytes(16));
    setcookie(
      "oyk-gid",
      $token,
      time() + 86400,
      "/",
      "",
      FALSE,
      TRUE
    );
    return $token;
  }

  return $_COOKIE["oyk-gid"];
}
