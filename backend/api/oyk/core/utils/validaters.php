<?php

function isHexColor($color) {
    return preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $color) === 1;
}