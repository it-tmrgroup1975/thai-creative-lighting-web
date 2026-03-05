<?php
// backend/api/get_product_detail.php
require_once 'cors.php';
require_once 'db_connect.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Product ID is required"]);
    exit;
}

try {
    // ดึงข้อมูลสินค้าพร้อม JOIN ข้อมูลที่เกี่ยวข้อง
    $sql = "SELECT p.*, c.name as category_name, a.name as application_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN applications a ON p.application_id = a.id
            WHERE p.id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if ($product) {
        // ดึงรายการรูปภาพทั้งหมด
        $sql_images = "SELECT image_url, is_main FROM product_images WHERE product_id = ? ORDER BY is_main DESC";
        $stmt_img = $pdo->prepare($sql_images);
        $stmt_img->execute([$id]);
        $images_data = $stmt_img->fetchAll();
        
        $product['images'] = array_column($images_data, 'image_url');
        $product['main_image'] = $images_data[0]['image_url'] ?? null;

        echo json_encode($product, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Product not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}