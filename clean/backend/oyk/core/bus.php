<?php

class EventBus {
  protected static $listeners = [];

  // Save listener
  public static function listen($eventName, $callback) {
    if (!isset(self::$listeners[$eventName])) {
      self::$listeners[$eventName] = [];
    }
    self::$listeners[$eventName][] = $callback;
  }

  // Dispatch event
  public static function dispatch($eventName, $payload = []) {
    if (!isset(self::$listeners[$eventName]))
      return;

    foreach (self::$listeners[$eventName] as $listener) {
      if (is_callable($listener)) {
        $listener($payload);
      }
      else {
        error_log("EventBus: listener for $eventName is not callable");
      }
    }
  }
}
