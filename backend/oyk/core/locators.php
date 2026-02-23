<?php

function oykAuthService(): AuthService {
  global $pdo;
  static $instance = NULL;
  if ($instance === NULL) {
    $instance = new AuthService($pdo);
  }
  return $instance;
}

function oykUserService(): UserService {
  global $pdo;
  static $instance = NULL;
  if ($instance === NULL) {
    $instance = new UserService($pdo);
  }
  return $instance;
}

function oykSecurityLogService(): LogService {
  global $pdo;
  static $instance = NULL;
  if ($instance === NULL) {
    $instance = new LogService($pdo);
  }
  return $instance;
}
