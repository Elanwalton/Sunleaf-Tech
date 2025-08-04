<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'connection.php';

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Get page & limit from query string (with defaults)
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

// First, get the total number of products
$countResult = $conn->query("SELECT COUNT(*) AS total FROM products");
$totalRow = $countResult->fetch_assoc();
$totalProducts = (int)$totalRow['total'];
$totalPages = ceil($totalProducts / $limit);

// Now fetch the paginated product data
$sql = "
SELECT 
  p.id, 
  p.main_image_url, 
  p.name, 
  p.price, 
  p.category, 
  IFNULL(AVG(r.rating), 0) AS rating, 
  COUNT(r.review_id) AS review_count
FROM 
  products p
LEFT JOIN 
  product_reviews r ON p.id = r.product_id
GROUP BY 
  p.id, p.main_image_url, p.name, p.price, p.category
ORDER BY p.id DESC
LIMIT $limit OFFSET $offset
";

$result = $conn->query($sql);

if ($result) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['rating'] = round((float)$row['rating'], 1); // round rating to 1 decimal
        $products[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'currentPage' => $page,
        'totalPages' => $totalPages,
        'limit' => $limit
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Query failed: ' . $conn->error
    ]);
}

$conn->close();
?>
