-- เรียกไฟล์นี้ผ่าน Browser เช่น http://localhost/backend/api/run_migration.php
-- ตารางหมวดหมู่หลัก (เช่น Outdoor Lighting, Solar Cell)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางประเภทการใช้งาน (เช่น ไฟผนัง, ไฟหัวเสา, ไฟทางเดิน)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางสินค้า
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    application_id INT,
    sku VARCHAR(100) UNIQUE NOT NULL, -- เช่น JUSTIN-B15
    name VARCHAR(255) NOT NULL,       -- เช่น CHANKAPOR
    style ENUM('Classic', 'Modern', 'Semi-Modern') NOT NULL,
    material VARCHAR(255),            -- เช่น อลูมิเนียม/เคลือบแก้ว
    size_info VARCHAR(255),           -- เช่น 18x23x33 cm.
    bulb_type VARCHAR(100),           -- เช่น E27
    price DECIMAL(10, 2) DEFAULT 0.00,
    stock_status ENUM('Ready to Ship', 'Out of Stock') DEFAULT 'Ready to Ship',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางเก็บรูปภาพสินค้า (1 สินค้ามีได้หลายรูป)
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;