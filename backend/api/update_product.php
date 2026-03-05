<?php
require_once 'cors.php';
require_once 'db_connect.php';

$id = $_GET['id'];

try {
    $pdo->beginTransaction();

    // 1. Update Product Details
    $stmt = $pdo->prepare("UPDATE products SET name=?, category_id=?, application_id=?, price=?, stock=?, style=?, wattage=?, color_temp_k=?, ip_rating=? WHERE id=?");
    $stmt->execute([
        $_POST['name'], $_POST['category_id'], $_POST['application_id'], 
        $_POST['price'], $_POST['stock'], $_POST['style'], 
        $_POST['wattage'], $_POST['color_temp_k'], $_POST['ip_rating'], $id
    ]);

    // 2. Handle Images (Delete old, Insert new)
    if (isset($_FILES['images'])) {
        // ลบข้อมูลรูปเดิมในตาราง (และอาจลบไฟล์จริงในเครื่องได้ถ้าต้องการ)
        $pdo->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$id]);

        $uploadDir = 'images/';
        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $fileName = "product_{$id}_" . time() . "_" . $key . ".jpg";
            $filePath = $uploadDir . $fileName;

            if (move_uploaded_file($tmpName, $filePath)) {
                $pdo->prepare("INSERT INTO product_images (product_id, image_url) VALUES (?, ?)")
                    ->execute([$id, $filePath]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Product updated!"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>