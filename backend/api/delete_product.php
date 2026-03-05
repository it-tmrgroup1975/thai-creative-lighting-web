<?php
require_once 'cors.php';
require_once 'db_connect.php';

$id = $_GET['id'];
$stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
if ($stmt->execute([$id])) {
    echo json_encode(["message" => "Product deleted"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete"]);
}