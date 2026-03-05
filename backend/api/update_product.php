<?php
// backend/api/update_product.php
require_once 'cors.php';
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $id = $_POST['id'] ?? null;
    if (!$id) throw new Exception("Product ID is required");

    // 1. อัปเดตข้อมูล Text และ Specs
    $sql = "UPDATE products SET 
            sku = ?, name = ?, category_id = ?, application_id = ?, 
            price = ?, style = ?, material = ?, size_info = ?, 
            bulb_type = ?, stock_status = ? 
            WHERE id = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $_POST['sku'], $_POST['name'], $_POST['category_id'], $_POST['application_id'],
        $_POST['price'], $_POST['style'], $_POST['material'], $_POST['size_info'],
        $_POST['bulb_type'], $_POST['stock_status'], $id
    ]);

    // 2. จัดการรูปภาพใหม่ (ถ้ามีการอัปโหลดเพิ่ม)
    if (!empty($_FILES['images']['name'][0])) {
        $upload_dir = '../../images/';
        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            $file_name = "product_" . $id . "_upd_" . time() . "_" . $key . ".jpg";
            if (move_uploaded_file($tmp_name, $upload_dir . $file_name)) {
                $db_path = "images/" . $file_name;
                $sql_img = "INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, 0)";
                $pdo->prepare($sql_img)->execute([$id, $db_path]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Product updated successfully"]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}