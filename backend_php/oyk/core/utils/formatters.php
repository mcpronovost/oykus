<?php

function slugify($text) {
    $text = preg_replace("~[^\pL\d]+~u", "-", $text);
    $text = iconv("UTF-8", "ASCII//TRANSLIT//IGNORE", $text);
    $text = preg_replace("~[^-\w]+~", "", $text);
    $text = trim($text, "-");
    $text = preg_replace("~-+~", "-", $text);
    $text = strtolower($text);

    return $text ?: "n-a";
}

function get_slug($pdo, $text, $table, $currentId = null, $scope = []) {
    $baseSlug = slugify($text);
    $slug = $baseSlug;
    $counter = 1;

    while (true) {
        $sql = "SELECT 1 FROM {$table} WHERE slug = :slug";
        $params = ["slug" => $slug];

        foreach ($scope as $field => $value) {
            $sql .= " AND {$field} = :{$field}";
            $params[$field] = $value;
        }

        if ($currentId !== null) {
            $sql .= " AND id != :id";
            $params["id"] = $currentId;
        }

        $sql .= " LIMIT 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if (!$stmt->fetch()) {
            break;
        }

        $slug = $baseSlug . "-" . $counter;
        $counter++;
    }

    return $slug;
}

function get_abbr($string, $max_length = 3) {
    $string = trim($string);
    if ($string === "") {
        return $string;
    }

    $parts = preg_split("/\s+/", $string);
    if (!$parts) {
        return $string;
    }

    // Single word
    if (count($parts) === 1) {
        return strtoupper($parts[0][0]);
    }

    $abbr = [];

    // First letter of first word
    $abbr[] = $parts[0][0];

    // First letter of last word
    $abbr[] = $parts[count($parts) - 1][0];

    // Middle words if there is room
    if (count($abbr) < $max_length && count($parts) > 2) {
        $middle = array_slice($parts, 1, -1);
        foreach ($middle as $word) {
            if (count($abbr) >= $max_length) {
                break;
            }
            array_splice($abbr, 1, 0, $word[0]);
        }
    }

    return strtoupper(substr(implode("", $abbr), 0, $max_length));
}

