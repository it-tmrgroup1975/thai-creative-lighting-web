<?php
// backend/api/cors.php

// อนุญาต Domain ที่ส่งมาจาก React (localhost:5173)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// *** จุดสำคัญ: ต้องอนุญาต Header "Authorization" และ "Content-Type" ***
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// ยอมรับการตรวจสอบสิทธิ์ (Credentials) หากจำเป็น
header("Access-Control-Allow-Credentials: true");

// จัดการ Preflight Request (Browser จะส่ง OPTIONS มาเช็คก่อนเสมอเมื่อมีการแนบ Token)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>