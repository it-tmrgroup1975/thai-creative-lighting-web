<?php
require_once 'cors.php'; // เรียกใช้ไฟล์จัดการ CORS ที่เราทำไว้
require_once 'db_connect.php';

// โค้ดสำหรับดึงข้อมูล...
$stmt = $pdo->query("SELECT id, name FROM applications");
echo json_encode($stmt->fetchAll());