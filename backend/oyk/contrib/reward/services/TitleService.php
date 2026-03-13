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

  public function getUserTitlesList(int $userId, int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT rt.id,
               rt.name
        FROM reward_titles rt
        JOIN reward_titles_users rut ON rut.title_id = rt.id
        WHERE rt.universe_id = ? AND rut.user_id = ?
      ");

      $qry->execute([$universeId, $userId]);
      $titles = $qry->fetchAll();
    }
    catch (Exception $e) {
      Response::serverError($e->getMessage());
    }

    return $titles ?: [];
  }

  public function getUserActiveTitle(int $userId): ?array {
    try {
      $qry = $this->pdo->prepare("
        SELECT rt.id, rt.name
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

    return $title ?: NULL;
  }

  public function giveUserTitle(int $userId, string $event): void {
    // Fetch titles matching the event
    try {
      $qry = $this->pdo->prepare("
        SELECT id, name FROM reward_titles
        WHERE how_to_obtain = :event
          AND (is_unique = 0 OR id NOT IN (
            SELECT title_id FROM reward_titles_users
          ))
          AND id NOT IN (
            SELECT title_id FROM reward_titles_users WHERE user_id = :userId
          )
      ");
      $qry->execute([":event" => $event, ":userId" => $userId]);
      $titles = $qry->fetchAll();
    }
    catch (Exception) {
      // fail silently
    }

    // Assign titles to the user
    foreach ($titles as $title) {
      try {
        $this->pdo->prepare("
          INSERT INTO reward_titles_users (user_id, title_id)
          VALUES (:userId, :titleId)
        ")->execute([":userId" => $userId, ":titleId" => $title["id"]]);

        // Send alert notification to the user
        oykCourrierAlertService()->createAlert(
          $userId,
          "You obtained a new title",
          "reward_title",
          "reward_titles",
          (int) $title["id"],
          [
            "title" => $title["name"]
          ]
        );
      }
      catch (Exception) {
        // fail silently
      }
    }
  }
}
