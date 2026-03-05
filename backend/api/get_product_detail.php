<?php
require_once 'cors.php';
require_once 'db_connect.php';

$id = $_GET['id'];

try {
    // ปรับ Query ให้ JOIN กับ product_images และใช้ GROUP_CONCAT เหมือนหน้า List
    $sql = "SELECT p.*, 
            GROUP_CONCAT(pi.image_url) as images 
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ?
            GROUP BY p.id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        // แปลง string images ให้เป็น Array (เหมือนเดิม)
        $product['images'] = $product['images'] ? explode(',', $product['images']) : [];
        echo json_encode($product);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Product not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => $e->getMessage()]);
}
?>