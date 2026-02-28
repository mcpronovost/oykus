<?php

class CharacterService {
  public function __construct(private PDO $pdo) {
  }

  public function getCommunity(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wmc.id, wmc.label, wmc.is_available, wmc.settings
        FROM world_modules_core wmc
        LEFT JOIN world_modules wm
            ON wm.core_id = wmc.id AND wm.universe_id = ?
        WHERE wm.id IS NULL
          AND wmc.is_visible = 1
        ORDER BY wmc.label ASC
      ");
      $qry->execute([$universeId]);
      $core_modules = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Core modules retrieval failed" . $e->getMessage());
    }
  }
}
