<?php

class Router {
  private static array $routes = [];

  public static function add(string $method, string $pattern, $handler) {
    self::$routes[] = [$method, $pattern, $handler];
  }

  public static function get(string $pattern, $handler) {
    self::add("GET", $pattern, $handler);
  }

  public static function post(string $pattern, $handler) {
    self::add("POST", $pattern, $handler);
  }

  public static function dispatch() {
    $method = $_SERVER["REQUEST_METHOD"];
    $uri = rtrim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/") ?: "/";

    foreach (self::$routes as [$routeMethod, $pattern, $handler]) {
      if ($method !== $routeMethod)
        continue;

      // Convertit /api/{slug}/edit → regex
      $regex = preg_replace("#\{([a-zA-Z0-9_]+)\}#", "([a-zA-Z0-9_-]+)", $pattern);
      $regex = "#^" . $regex . "$#";

      if (preg_match($regex, $uri, $matches)) {
        array_shift($matches);

        // Handler = fichier PHP ?
        if (is_string($handler) && file_exists($handler)) {
          // Injecte les paramètres dans le scope du fichier
          foreach ($matches as $i => $value) {
              // On récupère le nom du paramètre dans le pattern
              preg_match_all("#\{([a-zA-Z0-9_]+)\}#", $pattern, $paramNames);

              if (isset($paramNames[1][$i])) {
                  $varName = $paramNames[1][$i];
                  $$varName = $value; // crée $universeSlug = "alpha"
              }
          }

          return require $handler;
        }

        // Handler = callable ?
        if (is_callable($handler)) {
          return $handler(...$matches);
        }

        throw new Exception("Invalid route handler");
      }
    }

    // 404
    Response::notFound();
  }
}
