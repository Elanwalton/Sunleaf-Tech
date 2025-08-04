<?php
header('Content-Type: application/json');

require_once './connection.php';

$sql = "SELECT id, quote_number, customer_name, customer_email, created_at FROM quotations ORDER BY created_at DESC";
$result = $conn->query($sql);

$quotes = [];

if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $quotes[] = $row;
  }
}

echo json_encode([
  "success" => true,
  "data" => $quotes
]);

$conn->close();
?>


