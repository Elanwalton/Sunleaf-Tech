<?php
require '../vendor/autoload.php'; // Path to dompdf autoloader
require './connection.php'; // Your DB connection file

use Dompdf\Dompdf;

header('Content-Type: application/json');

// Parse JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (
  empty($data['customer_name']) ||
  empty($data['customer_email']) ||
  empty($data['items']) ||
  !is_array($data['items'])
) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required fields']);
  exit;
}

// Extract data
$customerName = $data['customer_name'];
$customerEmail = $data['customer_email'];
$items = $data['items'];
$tax = isset($data['tax']) ? floatval($data['tax']) : 0;
$discount = isset($data['discount']) ? floatval($data['discount']) : 0;
$notes = $data['notes'] ?? '';

// Generate a quote number
$quoteNumber = 'Q-' . time();

// Create subtotal and total
$subtotal = 0;
foreach ($items as $item) {
  $subtotal += $item['quantity'] * $item['price'];
}
$discountAmount = ($discount / 100) * $subtotal;
$taxAmount = (($subtotal - $discountAmount) * $tax) / 100;
$total = $subtotal - $discountAmount + $taxAmount;

// Step 1: Insert quote metadata into DB
$stmt = $conn->prepare("INSERT INTO quotations (quote_number, customer_name, customer_email, file_path) VALUES (?, ?, ?, '')");
$stmt->bind_param("sss", $quoteNumber, $customerName, $customerEmail);
$stmt->execute();
$quoteId = $stmt->insert_id;
$stmt->close();


//  Insert quote items into quote_items table
$itemStmt = $conn->prepare("INSERT INTO quote_items (quote_id, description, quantity, price) VALUES (?, ?, ?, ?)");

foreach ($items as $item) {
  $description = $item['description'];
  $quantity = intval($item['quantity']);
  $price = floatval($item['price']);
 

  $itemStmt->bind_param("isid", $quoteId, $description, $quantity, $price);
  $itemStmt->execute();
}

$itemStmt->close();


// Step 2: Generate PDF
$html = '<h2>Quotation</h2>';
$html .= "<p><strong>Quote #:</strong> $quoteNumber<br>";
$html .= "<strong>Customer:</strong> $customerName<br>";
$html .= "<strong>Email:</strong> $customerEmail</p>";
$html .= "<table border='1' cellpadding='6' cellspacing='0' width='100%'>
          <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>";

foreach ($items as $item) {
  $lineTotal = $item['quantity'] * $item['price'];
  $html .= "<tr>
              <td>{$item['description']}</td>
              <td>{$item['quantity']}</td>
              <td>KES " . number_format($item['price'], 2) . "</td>
              <td>KES " . number_format($lineTotal, 2) . "</td>
            </tr>";
}

$html .= "</table><br>";
$html .= "<p><strong>Subtotal:</strong> KES " . number_format($subtotal, 2) . "<br>";
$html .= "<strong>Discount:</strong> {$discount}%<br>";
$html .= "<strong>Tax:</strong> {$tax}%<br>";
$html .= "<strong>Total:</strong> KES " . number_format($total, 2) . "</p>";
if ($notes) {
  $html .= "<p><strong>Notes:</strong><br>" . nl2br(htmlspecialchars($notes)) . "</p>";
}

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$filename = "quote_$quoteId.pdf";
$folder = '../quotes/';
if (!is_dir($folder)) mkdir($folder, 0755, true);
$pdfPath = $folder . $filename;

file_put_contents($pdfPath, $dompdf->output());

// Step 3: Update quote record with PDF path
$filePathRelative = 'quotes/' . $filename;
$updateStmt = $conn->prepare("UPDATE quotations SET file_path = ? WHERE id = ?");
$updateStmt->bind_param("si", $filePathRelative, $quoteId);
$updateStmt->execute();
$updateStmt->close();

// Step 4: Respond
echo json_encode([
  'success' => true,
  'quote_id' => $quoteId,
  'quote_number' => $quoteNumber,
  'file_path' => $filePathRelative
]);
?>
