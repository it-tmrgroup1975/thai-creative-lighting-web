<?php
// 1. ตั้งค่า Headers สำหรับการเชื่อมต่อข้าม Origin (CORS)
require_once 'cors.php'; // Handle CORS

// ดักจับ Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. รับข้อมูลจาก Frontend
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// 3. ตรวจสอบข้อมูลเบื้องต้น
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

// 4. เชื่อมต่อฐานข้อมูล (เปลี่ยนค่าตามจริงของคุณ)
require_once 'db_connect.php'; // เรียกใช้งานไฟล์เชื่อมต่อ DB

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 5. ตรวจสอบว่า Email ซ้ำหรือไม่
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409); // Conflict
        echo json_encode(["message" => "Email already registered"]);
        exit;
    }

    // 6. เข้ารหัสรหัสผ่าน (สำคัญมาก!)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 7. บันทึกข้อมูล
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword]);

    http_response_code(201);
    echo json_encode(["message" => "User registered successfully"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}