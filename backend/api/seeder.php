<?php
require_once 'db_connect.php';

try {
    $pdo->beginTransaction();

    // 1. ล้างข้อมูลเก่า
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE product_images;");
    $pdo->exec("TRUNCATE TABLE products;");
    $pdo->exec("TRUNCATE TABLE categories;");
    $pdo->exec("TRUNCATE TABLE applications;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // 2. Insert Categories
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->execute(['Lighting']);
    $cat_lighting = $pdo->lastInsertId();
    $stmt->execute(['Solar Energy']);
    $cat_solar = $pdo->lastInsertId();

    // 3. Insert Applications
    $stmt = $pdo->prepare("INSERT INTO applications (name) VALUES (?)");
    $stmt->execute(['Indoor']);
    $app_indoor = $pdo->lastInsertId();
    $stmt->execute(['Outdoor']);
    $app_outdoor = $pdo->lastInsertId();

    // 4. Insert Products
    $products = [
        ['category_id' => $cat_lighting, 'application_id' => $app_indoor, 'name' => 'Modern Ceiling Lamp', 'style' => 'Modern', 'wattage' => 40, 'color_temp_k' => 3000, 'ip_rating' => 'IP20', 'price' => 1290.00, 'stock' => 50],
        ['category_id' => $cat_solar, 'application_id' => $app_outdoor, 'name' => 'Solar Garden Street Light', 'style' => 'Industrial', 'wattage' => 100, 'color_temp_k' => 6500, 'ip_rating' => 'IP65', 'price' => 2590.00, 'stock' => 20],
    ];

    $product_stmt = $pdo->prepare("INSERT INTO products (category_id, application_id, name, style, wattage, color_temp_k, ip_rating, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $image_stmt = $pdo->prepare("INSERT INTO product_images (product_id, image_url) VALUES (?, ?)");

    foreach ($products as $p) {
        $product_stmt->execute([$p['category_id'], $p['application_id'], $p['name'], $p['style'], $p['wattage'], $p['color_temp_k'], $p['ip_rating'], $p['price'], $p['stock']]);
        $product_id = $pdo->lastInsertId();

        // 5. Insert 5 images for each product
        for ($i = 1; $i <= 5; $i++) {
            $image_stmt->execute([$product_id, "images/product_{$product_id}_$i.jpg"]);
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Database seeded successfully!"]);

} catch (Exception $e) {
    // แก้ไขตรงนี้: เช็คก่อนว่ามีการทำ Transaction จริงหรือไม่
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>