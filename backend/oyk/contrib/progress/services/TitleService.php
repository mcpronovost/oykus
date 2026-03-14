<?php

class TitleService {
  public function __construct(private PDO $pdo) {
  }

  public function userCanCreateTitle(int $universeId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes
        WHERE id = ? AND owner_id = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function userCanEditTitle(int $universeId, int $titleId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$titleId || $titleId <= 0) {
      throw new NotFoundException("Title not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes
        WHERE id = ? AND owner_id = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function userCanDeleteTitle(int $universeId, int $titleId, int $userId): bool {
    if (!$universeId || $universeId <= 0) {
      throw new NotFoundException("Universe not found");
    }
    if (!$titleId || $titleId <= 0) {
      throw new NotFoundException("Title not found");
    }
    if (!$userId || $userId <= 0) {
      throw new NotFoundException("User not found");
    }

    $qry = $this->pdo->prepare("
      SELECT EXISTS (
        SELECT 1
        FROM world_universes
        WHERE id = ? AND owner_id = ?
      )
    ");
    $qry->execute([$universeId, $userId]);
    return (bool) $qry->fetchColumn();
  }

  public function validateData(array $data): array {
    $fields = [];

    // Name
    if (array_key_exists("name", $data)) {
      $name = trim($data["name"]);
      if ($name === "") {
        throw new ValidationException("Name cannot be empty");
      }
      $fields["name"] = substr($name, 0, 120);
    }

    // Description
    if (array_key_exists("description", $data)) {
      $description = trim($data["description"]);
      $fields["description"] = substr($description, 0, 120);
    }

    // How to obtain
    if (array_key_exists("how_to_obtain", $data)) {
      $how_to_obtain = trim($data["how_to_obtain"]);
      if ($how_to_obtain === "") {
        $how_to_obtain = "manual";
      }
      $fields["how_to_obtain"] = $how_to_obtain;
    }

    // Is Unique
    if (array_key_exists("is_unique", $data)) {
      $is_unique = $data["is_unique"] == "true" ? 1 : 0;
      $fields["is_unique"] = $is_unique;
    }

    // Is Hidden
    if (array_key_exists("is_hidden", $data)) {
      $is_hidden = $data["is_hidden"] == "true" ? 1 : 0;
      $fields["is_hidden"] = $is_hidden;
    }

    // Target
    if (array_key_exists("target", $data)) {
      $target = trim($data["target"]);
      if ($target === "") {
        $target = "character";
      }
      $fields["target"] = $target;
    }

    return $fields;
  }

  public function validateCreateData(array $data): array {
    $data = $this->validateData($data);

    if (!isset($data["name"])) {
      throw new ValidationException("Missing name");
    }

    return [
      "name" => $data["name"],
      "description" => $data["description"] ?? NULL,
      "how_to_obtain" => $data["how_to_obtain"] ?? "manual",
      "is_unique" => $data["is_unique"] ?? 0,
      "is_hidden" => $data["is_hidden"] ?? 0,
      "target" => $data["target"] ?? "character",
    ];
  }

  public function getUserTitlesList(int $userId, int $universeId): array {
    try {
      $qry = $this->pdo->prepare("
        SELECT rt.id,
               rt.name
        FROM progress_titles rt
        JOIN progress_titles_users rut ON rut.title_id = rt.id
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
        FROM progress_titles_users rut
        JOIN progress_titles rt ON rt.id = rut.title_id
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
        SELECT id, name FROM progress_titles
        WHERE how_to_obtain = :event
          AND (is_unique = 0 OR id NOT IN (
            SELECT title_id FROM progress_titles_users
          ))
          AND id NOT IN (
            SELECT title_id FROM progress_titles_users WHERE user_id = :userId
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
          INSERT INTO progress_titles_users (user_id, title_id)
          VALUES (:userId, :titleId)
        ")->execute([":userId" => $userId, ":titleId" => $title["id"]]);

        // Send alert notification to the user
        oykCourrierAlertService()->createAlert(
          $userId,
          "You obtained a new title",
          "progress_title",
          "progress_titles",
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
        FROM progress_titles rt
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

  public function createTitle(int $universeId, array $fields): void {
    try {
      $this->pdo->prepare("
        INSERT INTO progress_titles (universe_id, name, description, how_to_obtain, target, is_unique, is_hidden)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      ")->execute([
            $universeId,
            $fields["name"],
            $fields["description"],
            $fields["how_to_obtain"],
            $fields["target"],
            $fields["is_unique"],
            $fields["is_hidden"]
          ]);
    }
    catch (Exception $e) {
      throw new QueryException($e->getMessage());
    }
  }

  public function updateTitle(int $universeId, int $titleId, array $fields): void {
    try {
      $this->pdo->prepare("
        UPDATE progress_titles
        SET name = ?,
            description = ?,
            how_to_obtain = ?,
            target = ?,
            is_unique = ?,
            is_hidden = ?
        WHERE id = ? AND universe_id = ?
      ")->execute([
            $fields["name"],
            $fields["description"],
            $fields["how_to_obtain"],
            $fields["target"],
            $fields["is_unique"],
            $fields["is_hidden"],
            $titleId,
            $universeId
          ]);
    }
    catch (Exception $e) {
      throw new QueryException($e->getMessage());
    }
  }

  public function deleteTitle(int $universeId, int $titleId): void {
    try {
      $this->pdo->prepare("
        DELETE FROM progress_titles
        WHERE id = ? AND universe_id = ?
      ")->execute([$titleId, $universeId]);
    }
    catch (Exception $e) {
      throw new QueryException($e->getMessage());
    }
  }
}
