<?php
session_start([
    'cookie_lifetime' => 86400, // 1 day
    'cookie_secure'   => false, // Should be true in production (HTTPS only)
    'cookie_httponly' => true,  // Prevent JavaScript access
    'cookie_samesite' => 'none'  // CSRF protection
]);// Add this after session_start()
error_log('Received Cookies: ' . print_r($_COOKIE, true));

if (empty($_COOKIE['PHPSESSID'])) {
    error_log('WARNING: No session cookie received!');
}

// CORS Configuration
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
header('Access-Control-Allow-Credentials: true');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Only POST requests are allowed"]);
    exit();
}

// Include database connection
include_once("connection.php");

// Get and validate input
$data = json_decode(file_get_contents("php://input"), true) ?? [];
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Valid email and password are required"]);
    exit();
}

// User lookup with prepared statement
try {
    $stmt = $conn->prepare("SELECT id, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            // Regenerate session ID to prevent fixation
            session_regenerate_id(true);
            
            // Set session data
            $_SESSION = [
                'user_id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'logged_in' => true,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT']
            ];
            
            // Successful response
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>