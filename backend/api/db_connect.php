<?php
// backend/api/db_connect.php
$host = 'localhost';
$db   = 'tcl_web_db'; // เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ
$user = 'root';               // เปลี่ยนเป็น username ของคุณ
$pass = '';                   // เปลี่ยนเป็น password ของคุณ

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    // ตั้งค่าให้ PDO แสดง Exception เวลาเจอ Error (ช่วยให้ Debug ง่ายขึ้น)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Connection failed: " . $e->getMessage()]);
    exit;
}
?>