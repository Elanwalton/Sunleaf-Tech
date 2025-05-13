<?php
session_start();
session_unset(); // Unset all session variables
session_destroy(); // Destroy the session

// Allow CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (ini_get("session.use_cookies")) {
    setcookie(session_name(), '', time() - 42000, '/');
}

echo json_encode(["message" => "Logged out successfully"]);
?>
