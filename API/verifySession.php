<?php
/**
 * verifySession.php – Verifies session from SPA
 * 
 * .env expected:
 * - REDIS_DSN="tcp://127.0.0.1:6379?database=0&timeout=2.5&prefix=PHPREDIS_SESSION:"
 * - COOKIE_SECURE=false
 * - COOKIE_SAMESITE=Lax
 * - SPA_ORIGIN=http://localhost:5173
 * - APP_DEBUG=true (optional)
 */

// ---------------------------
//  CORS for SPA access
// ---------------------------
$origin = getenv('SPA_ORIGIN') ?: 'http://localhost:5173';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------
//  Session config (Redis backend)
// ---------------------------
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', getenv('REDIS_DSN') ?: 'tcp://127.0.0.1:6379?database=0');

ini_set('session.cookie_secure', filter_var(getenv('COOKIE_SECURE'), FILTER_VALIDATE_BOOLEAN) ? '1' : '0');
ini_set('session.cookie_samesite', getenv('COOKIE_SAMESITE') ?: 'Lax');
ini_set('session.cookie_path', '/');

// Start session BEFORE any output
session_start();

// ---------------------------
//  DEBUG logging
// ---------------------------
if (getenv('APP_DEBUG')) {
    error_log('SESSION DEBUG - verifySession.php');
    error_log('session_id = ' . session_id());
    error_log('$_SESSION = ' . json_encode($_SESSION));
}

// ---------------------------
//  Connect to DB
// ---------------------------
require_once __DIR__ . '/connection.php'; // provides $conn

$response = [
    'authenticated' => false,
    'user'          => null,
    'message'       => 'Not authenticated',
];

// ---------------------------
//  Auth logic
// ---------------------------
if (!empty($_SESSION['user_id'])) {
    try {
        $stmt = $conn->prepare('SELECT id, email, first_name, role FROM users WHERE id = ? LIMIT 1');
        $stmt->bind_param('i', $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            $response = [
                'authenticated' => true,
                'user' => [
                    'id'    => (int) $user['id'],
                    'email' => $user['email'],
                    "firstName" => $user['first_name'],   // ← camel‑case to match TS
                    'role'  => $user['role'],
                ],
                'message' => 'Authenticated',
            ];
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        $response['message'] = 'Server error: ' . $e->getMessage();
    }
}

// ---------------------------
//  Return JSON
// ---------------------------
header('Content-Type: application/json');
echo json_encode($response);
exit;
?>
