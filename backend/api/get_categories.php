<?php
// ตัวอย่าง get_categories.php

require_once 'cors.php';
require_once 'db_connect.php';
$stmt = $pdo->query("SELECT id, name FROM categories");
echo json_encode($stmt->fetchAll());