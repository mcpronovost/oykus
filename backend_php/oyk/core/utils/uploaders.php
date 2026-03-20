<?php

function oyk_save_image($file, $dstSizeW = 200, $dstSizeH = 200, $field = "avatars", $prefix = "", $maxSize = 2) {
    if ($file["size"] > $maxSize * 1024 * 1024) {
        http_response_code(400);
        exit;
    }

    $dst = imagecreatetruecolor($dstSizeW, $dstSizeH);

    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefill($dst, 0, 0, $transparent);

    $src = imagecreatefromstring(file_get_contents($file["tmp_name"]));
    $srcW = imagesx($src);
    $srcH = imagesy($src);
    $size = min($srcW, $srcH);
    $srcX = intval(($srcW - $size) / 2);
    $srcY = intval(($srcH - $size) / 2);

    $dstRatio = $dstSizeW / $dstSizeH;
    $srcRatio = $srcW / $srcH;

    if ($srcRatio > $dstRatio) {
        // source is wider
        $cropH = $srcH;
        $cropW = intval($srcH * $dstRatio);
        $srcX = intval(($srcW - $cropW) / 2);
        $srcY = 0;
    } else {
        // source is taller
        $cropW = $srcW;
        $cropH = intval($srcW / $dstRatio);
        $srcX = 0;
        $srcY = intval(($srcH - $cropH) / 2);
    }

    imagecopyresampled(
        $dst,
        $src,
        0, 0,
        $srcX, $srcY,
        $dstSizeW, $dstSizeH,
        $cropW, $cropH
    );

    $filename = uniqid($prefix ? $prefix."_" : "").".webp";
    $path = __DIR__ . "/../../../uploads/".$field."/".$filename;

    imagewebp($dst, $path, 85);

    return "/uploads/".$field."/".$filename;
}
