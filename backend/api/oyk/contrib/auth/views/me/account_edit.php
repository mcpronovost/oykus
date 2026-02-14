<?php

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
  SELECT id, username, email, timezone
  FROM auth_users
  WHERE id = ?
  LIMIT 1
");
$qry->execute([$authUser["id"]]);
$user = $qry->fetch();

if (!$user) {
  Response::notFound("User not found");
}

/*
|--------------------------------------------------------------------------
| Collect PATCH data
|--------------------------------------------------------------------------
*/
$patch = [];
$params = ["id" => $user["id"]];

/* ---------- Username ---------- */
if (isset($_POST["username"]) && $_POST["username"] !== $user["username"]) {
  $patch["username"] = $_POST["username"];
  $params["username"] = $_POST["username"];
}

/* ---------- Email ---------- */
if (isset($_POST["email"]) && $_POST["email"] !== $user["email"]) {
  $patch["email"] = $_POST["email"];
  $params["email"] = $_POST["email"];
}

/* ---------- Timezone ---------- */
if (isset($_POST["timezone"]) && $_POST["timezone"] !== $user["timezone"]) {
  $patch["timezone"] = $_POST["timezone"];
  $params["timezone"] = $_POST["timezone"];
}

/*
|--------------------------------------------------------------------------
| Nothing to update → OK
|--------------------------------------------------------------------------
*/
if (!$patch) {
  Response::json(["ok" => TRUE, "account" => $user]);
}

/*
|--------------------------------------------------------------------------
| Persist PATCH (transaction-safe)
|--------------------------------------------------------------------------
*/
$pdo->beginTransaction();

try {
  $sets = [];
  foreach ($patch as $field => $_) {
    $sets[] = "$field = :$field";
  }

  $sql = "
        UPDATE auth_users
        SET " . implode(", ", $sets) . "
        WHERE id = :id
    ";

  $pdo->prepare($sql)->execute($params);
  $pdo->commit();
}
catch (Exception $e) {
  $pdo->rollBack();
  Response::serverError();
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
$user = array_merge($user, $patch);

Response::json([
  "ok" => TRUE,
  "account" => $user
]);
