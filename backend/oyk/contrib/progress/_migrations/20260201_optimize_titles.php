<?php
global $pdo;

$pdo->exec("
    CREATE INDEX idx_universe ON progress_titles(universe_id);
    CREATE INDEX idx_howtoobtain ON progress_titles(how_to_obtain);
    CREATE INDEX idx_howtoobtain_unique ON progress_titles(how_to_obtain, is_unique);
");