<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

function dump_session_ini() {
    foreach ([
        'session.save_handler',
        'session.save_path',
        'session.cookie_domain',
        'session.cookie_path',
        'session.cookie_samesite',
        'session.cookie_secure',
        'session.gc_maxlifetime'
    ] as $k) {
        error_log("$k = " . ini_get($k));
    }
}
dump_session_ini();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_lifetime' => 86400,
        'cookie_path'     => '/',
        'cookie_secure' => false,    // Change to true in production with HTTPS
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
    ]);
require_once 'bootstrap.php';  // Make sure this sets error display off, starts session properly
include_once "connection.php";
$raw = file_get_contents('php://input');
error_log("RAW INPUT: " . $raw);
$input = json_decode($raw, true);
ini_set('log_errors', '1');                       // turn logging on
ini_set('error_log',  __DIR__ . '/debug.log');    // log right beside this file

error_log("DECODED INPUT: " . print_r($input, true));

}

error_log(
    'SESSION-DEBUG ' . basename(__FILE__) .
    ' id=' . session_id() . ' -> ' . json_encode($_SESSION)
);

// Parse JSON input
$input = json_decode(file_get_contents("php://input"), true);
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Valid email and password are required"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT id, email, first_name, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            // Regenerate session ID to prevent fixation attacks
            session_regenerate_id(true);

            // Set session data
            $_SESSION = [
                'user_id' => $user['id'],
                'email' => $user['email'],
                'first_name' => $user['firstname'] ?? '',
                'role' => $user['role'],
                'logged_in' => true,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ];

            error_log(
                'SESSION-DEBUG ' . basename(__FILE__) .
                ' id=' . session_id() . ' -> ' . json_encode($_SESSION)
            );

            http_response_code(200);
            echo json_encode([
                "authenticated" => true,
                "message" => "Login successful",
                "user" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "role" => $user['role']
                ],
                "session_id" => session_id()
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
}
