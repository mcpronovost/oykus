<?php
global $pdo;

$pdo->exec("
CREATE TABLE IF NOT EXISTS world_charactersheets (
    `id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `character_id` int UNSIGNED NOT NULL UNIQUE,

    `content` JSON NULL,

    `status` enum('draft', 'submitted', 'accepted', 'rejected') NOT NULL DEFAULT 'draft',

    `rejected_reason` text NULL,
    `validated_by` int UNSIGNED NULL,
    `validated_at` datetime NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_wcs_character
        FOREIGN KEY (character_id) REFERENCES world_characters(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wcs_validator
        FOREIGN KEY (validated_by) REFERENCES auth_users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;
");
