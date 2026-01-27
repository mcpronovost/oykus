<?php

header("Content-Type: application/json");

global $pdo;
$authUser = require_auth();

/*
|--------------------------------------------------------------------------
| Load current user
|--------------------------------------------------------------------------
*/
$qry = $pdo->prepare("
    SELECT id, username, email
    FROM auth_users
    WHERE id = :id
    LIMIT 1
");
$qry->execute(["id" => $authUser["id"]]);
$user = $qry->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
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

/*
|--------------------------------------------------------------------------
| Nothing to update → OK
|--------------------------------------------------------------------------
*/
if (!$patch) {
    unset($user["id"]);
    echo json_encode(["ok" => true, "account" => $user]);
    exit;
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
        SET ".implode(", ", $sets)."
        WHERE id = :id
    ";

    $pdo->prepare($sql)->execute($params);
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getCode()]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Return updated resource
|--------------------------------------------------------------------------
*/
$user = array_merge($user, $patch);
unset($user["id"]);

echo json_encode([
    "ok" => true,
    "account" => $user
]);
