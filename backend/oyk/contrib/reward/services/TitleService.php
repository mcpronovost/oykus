<?php

class TitleService {
  public function __construct(private PDO $pdo) {
  }

  public function getTitlesList(int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT rt.id,
               rt.name,
               rt.description,
               rt.how_to_obtain,
               rt.target,
               rt.is_unique,
               rt.is_hidden
        FROM reward_titles rt
        WHERE rt.universe_id = ?
      ");

      $qry->execute([$universeId]);
      $titles = $qry->fetchAll();
    }
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    return $titles ?: [];
  }

  public function getActiveTitle(int $userId): ?string {
    try {
      $qry = $this->pdo->prepare("
        SELECT rt.name
        FROM reward_titles_users rut
        JOIN reward_titles rt ON rt.id = rut.title_id
        WHERE rut.user_id = ? AND
              rut.is_active = 1
        LIMIT 1
      ");

      $qry->execute([$userId]);
      $title = $qry->fetch();
    }
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    return $title ? $title["name"] : NULL;
  }
}
