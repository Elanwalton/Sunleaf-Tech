<?php
include './connection.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uploadDir = __DIR__ . '/../products/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

$urls = [];
// Main image
if (isset($_FILES['main_image']) && $_FILES['main_image']['error'] === UPLOAD_ERR_OK) {
    $name = uniqid() . '_' . basename($_FILES['main_image']['name']);
    move_uploaded_file($_FILES['main_image']['tmp_name'], $uploadDir . $name);
    $urls[] = "products/{$name}";
}
// Thumbnails
if (isset($_FILES['thumbnails'])) {
    foreach ($_FILES['thumbnails']['tmp_name'] as $i => $tmp) {
        if ($_FILES['thumbnails']['error'][$i] === UPLOAD_ERR_OK) {
            $n = uniqid() . '_' . basename($_FILES['thumbnails']['name'][$i]);
            move_uploaded_file($tmp, $uploadDir . $n);
            $urls[] = "products/{$n}";
        }
    }
}
echo json_encode(["success" => true, "urls" => $urls]);