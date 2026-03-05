<?php
// backend/api/add_product.php
require_once 'cors.php';
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. รับข้อมูลพื้นฐานและ Technical Specs
    $sku = $_POST['sku'] ?? '';
    $name = $_POST['name'] ?? '';
    $category_id = $_POST['category_id'] ?? null;
    $application_id = $_POST['application_id'] ?? null;
    $price = $_POST['price'] ?? 0;
    $style = $_POST['style'] ?? 'Classic';
    $material = $_POST['material'] ?? '';
    $size_info = $_POST['size_info'] ?? '';
    $bulb_type = $_POST['bulb_type'] ?? '';
    $stock_status = $_POST['stock_status'] ?? 'Ready to Ship';

    // 2. บันทึกข้อมูลลงตาราง products
    $sql = "INSERT INTO products (sku, name, category_id, application_id, price, style, material, size_info, bulb_type, stock_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$sku, $name, $category_id, $application_id, $price, $style, $material, $size_info, $bulb_type, $stock_status]);
    $product_id = $pdo->lastInsertId();

    // 3. จัดการอัปโหลดรูปภาพ (ถ้ามี)
    if (!empty($_FILES['images']['name'][0])) {
        $upload_dir = '../../images/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            $file_name = "product_" . $product_id . "_" . time() . "_" . $key . ".jpg";
            $upload_path = $upload_dir . $file_name;
            $db_path = "images/" . $file_name;

            if (move_uploaded_file($tmp_name, $upload_path)) {
                $is_main = ($key === 0) ? 1 : 0; // รูปแรกเป็นรูปหลัก
                $sql_img = "INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)";
                $pdo->prepare($sql_img)->execute([$product_id, $db_path, $is_main]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Product added successfully", "id" => $product_id]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}