<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once 'connection.php'; // Ensure this uses mysqli_connect()

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]);
    exit;
}

$sql = "SELECT * FROM products";
$result = $conn->query($sql);

if ($result) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Query failed: ' . $conn->error
    ]);
}

$conn->close();
?>