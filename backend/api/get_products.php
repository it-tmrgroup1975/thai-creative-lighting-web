<?php
// backend/api/get_products.php

require_once 'cors.php'; // Handle CORS
require_once 'db_connect.php'; // เรียกใช้งานไฟล์เชื่อมต่อ DB

// จัดการ Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // ใช้ SQL JOIN เพื่อดึงข้อมูลที่เกี่ยวข้องทั้งหมด
    $sql = "SELECT 
                p.id, p.name, p.price, p.stock, p.style, p.wattage, p.color_temp_k, p.ip_rating,
                c.name as category_name, 
                a.name as application_name,
                GROUP_CONCAT(pi.image_url) as images
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN applications a ON p.application_id = a.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            GROUP BY p.id";

    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll();

    // แปลงข้อมูลรูปภาพจาก String เป็น Array
    $results = array_map(function ($product) {
        $product['images'] = $product['images'] ? explode(',', $product['images']) : [];
        // แปลง price เป็น float เพื่อความแม่นยำทางตัวเลข
        $product['price'] = (float)$product['price'];
        return $product;
    }, $products);

    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
