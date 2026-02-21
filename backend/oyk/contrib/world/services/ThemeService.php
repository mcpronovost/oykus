<?php

class ThemeService {
  protected $pdo;

  public function __construct($pdo) {
    $this->pdo = $pdo;
  }

  public function getActiveTheme($universeId) {
    try {
      $qry = $this->pdo->prepare("
        SELECT id, c_primary, c_primary_fg, variables
        FROM world_themes
        WHERE universe = ?
          AND is_active = 1
        LIMIT 1
      ");

      $qry->execute([$universeId]);

      $theme = $qry->fetch();

      if (!$theme) {
        $qry = $this->pdo->prepare("
          INSERT INTO world_themes (universe, name, c_primary, c_primary_fg, variables, is_active)
          VALUES (?, ?, '#3DA5CB', '#FFFFFF', '{}', 1);
        ");

        $qry->execute([$universeId, "Default"]);

        $themeId = $this->pdo->lastInsertId();

        $qry = $this->pdo->prepare("
          SELECT c_primary, c_primary_fg, variables
          FROM world_themes
          WHERE id = ?
          LIMIT 1
        ");
        $qry->execute([$themeId]);
        $theme = $qry->fetch();
      }

      if ($theme && !empty($theme["variables"])) {
        $theme["variables"] = json_decode($theme["variables"], TRUE);
      }
    }
    catch (Exception $e) {
      http_response_code(500);
      echo json_encode(["error" => "Theme not found"]);
      exit;
    }

    return $theme ?: NULL;
  }
}
