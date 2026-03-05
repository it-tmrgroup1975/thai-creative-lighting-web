<?php
require_once __DIR__ . '/../autoloader.php';
use App\Config\Database;

try {
    $db = Database::getConnection();
    $sql = file_get_contents(__DIR__ . '/../database/migrations/01_create_initial_tables.sql');
    
    // รันคำสั่ง SQL
    $db->exec($sql);
    
    echo "Migration successfully! ตารางถูกสร้างเรียบร้อยแล้ว";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage();
}