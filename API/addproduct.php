<?php
include './connection.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse JSON
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

// Validate
$required = ['name','description','category','status','price','quantity'];
foreach ($required as $f) {
    if (!isset($data[$f]) || $data[$f] === '') {
        echo json_encode(["success"=>false, "message"=>"Missing field: $f"]);
        exit;
    }
}

$name   = htmlspecialchars(strip_tags($data['name']));
$desc   = htmlspecialchars(strip_tags($data['description']));
$cat    = htmlspecialchars(strip_tags($data['category']));
$status = htmlspecialchars(strip_tags($data['status']));
$price  = floatval($data['price']);
$qty    = intval($data['quantity']);
$main   = $data['main_image_url'];
$thumbs = json_encode($data['thumbnails']);

// Insert
$stmt = $conn->prepare(
    "INSERT INTO products
     (name,description,category,status,price,quantity,main_image_url,thumbnail_urls,created_at)
     VALUES (?,?,?,?,?,?,?,? ,NOW())"
);
$stmt->bind_param("ssssdiss", $name,$desc,$cat,$status,$price,$qty,$main,$thumbs);
if ($stmt->execute()) {
    echo json_encode(["success"=>true, "message"=>"Product added successfully"]);
} else {
    echo json_encode(["success"=>false, "message"=>"DB Error: " . $stmt->error]);
}
$stmt->close();
$conn->close();