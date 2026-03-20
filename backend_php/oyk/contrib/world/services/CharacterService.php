<?php

class CharacterService {
  public function __construct(private PDO $pdo) {
  }

  public function getCommunity(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wc.id,
               wc.name,
               wc.slug,
               wc.abbr,
               wc.avatar,
               wc.cover,
               (au.lastlive_at >= NOW() - INTERVAL 5 MINUTE) AS is_online
        FROM world_characters wc
        LEFT JOIN auth_users au ON au.id = wc.user_id
        WHERE wc.universe_id = ?
          AND wc.is_active = 1
      ");
      $qry->execute([$universeId]);
      $characters = $qry->fetchAll();
    }
    catch (Exception $e) {
      throw new QueryException("Characters retrieval failed" . $e->getMessage());
    }

    return $characters ?: [];
  }

  public function getProfile(int $universeId, string $characterSlug): ?array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wc.id,
               wc.name,
               wc.slug,
               wc.abbr,
               wc.avatar,
               wc.cover
        FROM world_characters wc
        WHERE wc.universe_id = ?
          AND wc.slug = ?
          AND wc.is_active = 1
        LIMIT 1
      ");
      $qry->execute([$universeId, $characterSlug]);
      $character = $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Character retrieval failed" . $e->getMessage());
    }

    return $character ?: null;
  }

  public function getActiveCharacter(int $universeId): ?array {
    try {
      $qry = $this->pdo->prepare("
        SELECT wc.id,
               wc.name,
               wc.slug,
               wc.abbr,
               wc.avatar,
               wc.cover
        FROM world_characters wc
        WHERE wc.universe_id = ?
          AND wc.is_active = 1
        LIMIT 1
      ");
      $qry->execute([$universeId]);
      $character = $qry->fetch();
    }
    catch (Exception $e) {
      throw new QueryException("Character retrieval failed" . $e->getMessage());
    }

    return $character ?: null;
  }
}
