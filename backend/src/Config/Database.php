<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            // ในอนาคตควรใช้ค่าจากไฟล์ .env
            $host = 'localhost';
            $db   = 'tcl_web_db';
            $user = 'root';
            $pass = '';
            
            try {
                self::$instance = new PDO(
                    "mysql:host=$host;dbname=$db;charset=utf8mb4",
                    $user,
                    $pass,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["message" => "Database Connection Error: " . $e->getMessage()]);
                exit;
            }
        }
        return self::$instance;
    }
}