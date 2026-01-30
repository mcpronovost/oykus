<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS game_themes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    universe INT UNSIGNED NOT NULL,

    name VARCHAR(120) NOT NULL,

    c_primary VARCHAR(7) NOT NULL,
    c_primary_fg VARCHAR(7) NOT NULL,

    core_bg VARCHAR(7),
    core_fg VARCHAR(7),
    core_bg_img VARCHAR(255),
    core_divider VARCHAR(7),

    c_danger VARCHAR(7),
    c_warning VARCHAR(7),
    c_success VARCHAR(7),

    app_header_bg VARCHAR(7),
    app_header_fg VARCHAR(7),

    app_sidebar_bg VARCHAR(7),
    app_sidebar_fg VARCHAR(7),
    app_sidebar_bg_subtle VARCHAR(7),

    popper_bg VARCHAR(7),
    popper_fg VARCHAR(7),
    popper_item_bg VARCHAR(7),
    popper_item_fg VARCHAR(7),

    card_bg VARCHAR(7),
    card_fg VARCHAR(7),
    card_subtle_bg VARCHAR(7),
    card_subtle_fg VARCHAR(7),
    card_item_bg VARCHAR(7),
    card_item_fg VARCHAR(7),
    card_item_subtle VARCHAR(7),
    card_divider VARCHAR(7),

    scrollbar VARCHAR(7),

    radius VARCHAR(4),

    is_active BOOL NOT NULL DEFAULT 0,

    INDEX idx_universe (universe),

    FOREIGN KEY (universe) REFERENCES game_universes(id) ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
