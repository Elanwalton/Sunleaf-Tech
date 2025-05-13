<?php

// Start the session
session_start();
// Enable CORS for frontend on different port (Vite dev server)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, withcredentials");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
header('Access-Control-Allow-Credentials: true');




// Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Only POST requests are allowed"]);
    exit();
}

// Include database connection
include_once("connection.php");

// Decode JSON input from frontend
$data = json_decode(file_get_contents("php://input"), true);

// Sanitize input
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password are required."]);
    exit();
}

// Prepare and execute query
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($password, $user['password'])) {
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role']; // assuming 'role' column exists in DB

        $sessionId = session_id();

        http_response_code(200);
        echo json_encode([
            "message" => "Login successful",
            "sessionId" => $sessionId,
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
       

    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid password"]);
    }
} else {
    http_response_code(401);
    echo json_encode(["message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
