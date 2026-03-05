<?php
require_once 'cors.php';
require_once 'db_connect.php';

try {
    $pdo->beginTransaction();

    // 1. Insert Product
    $stmt = $pdo->prepare("INSERT INTO products (name, category_id, application_id, price, stock, style, wattage, color_temp_k, ip_rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $_POST['name'], $_POST['category_id'], $_POST['application_id'], 
        $_POST['price'], $_POST['stock'], $_POST['style'], 
        $_POST['wattage'], $_POST['color_temp_k'], $_POST['ip_rating']
    ]);
    
    $product_id = $pdo->lastInsertId();

    // 2. Handle Image Uploads
    if (isset($_FILES['images'])) {
        $uploadDir = 'images/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $fileName = "product_{$product_id}_" . time() . "_" . $key . ".jpg";
            $filePath = $uploadDir . $fileName;

            if (move_uploaded_file($tmpName, $filePath)) {
                $pdo->prepare("INSERT INTO product_images (product_id, image_url) VALUES (?, ?)")
                    ->execute([$product_id, $filePath]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Product created!"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>