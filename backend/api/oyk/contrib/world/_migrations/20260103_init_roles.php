<?php
global $pdo;

$sql = "
CREATE TABLE IF NOT EXISTS world_roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user INT UNSIGNED NOT NULL,
    universe INT UNSIGNED NOT NULL,

    role TINYINT UNSIGNED NOT NULL DEFAULT 6,

    INDEX idx_user (user),
    INDEX idx_universe (universe),

    CONSTRAINT uq_user_universe UNIQUE (user, universe),

    CONSTRAINT fk_world_roles_user
        FOREIGN KEY (user) REFERENCES auth_users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_world_roles_universe
        FOREIGN KEY (universe) REFERENCES world_universes(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
";

$pdo->exec($sql);
