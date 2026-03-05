<?php
// --- 1. CORS & Preflight Handler ---
require_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- 2. รับข้อมูลจาก Frontend ---
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// --- 3. การเชื่อมต่อ Database (PDO) ---
require_once 'db_connect.php'; // เรียกใช้งานไฟล์เชื่อมต่อ DB

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 4. ตรวจสอบ User ในฐานข้อมูล ---
    $stmt = $pdo->prepare("SELECT id, name, password FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // --- 5. ตรวจสอบรหัสผ่าน ---
    if ($user && password_verify($password, $user['password'])) {
        // ในอนาคตควรใช้ JWT แทนครับ (ตอนนี้ส่ง Token จำลองไปก่อน)
        echo json_encode([
            "status" => "success", 
            "token" => "mock-jwt-token-12345", 
            "user" => [
                "id" => $user['id'],
                "name" => $user['name']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Login failed: Incorrect email or password"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>