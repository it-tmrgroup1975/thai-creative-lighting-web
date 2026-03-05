<?php
require_once __DIR__ . '/../autoloader.php';
use App\Config\Database;

require_once 'cors.php';

$db = Database::getConnection();

// Query ดึงข้อมูลพร้อมรูปภาพหลัก (Main Image)
$query = "SELECT p.*, i.image_url as main_image 
          FROM products p 
          LEFT JOIN product_images i ON p.id = i.product_id AND i.is_main = 1";

try {
    $stmt = $db->query($query);
    $products = $stmt->fetchAll();

    // ส่งข้อมูลออกเป็น JSON โดยใช้ JSON_UNESCAPED_UNICODE เพื่อภาษาไทย
    echo json_encode([
        "status" => "success",
        "data" => $products
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}