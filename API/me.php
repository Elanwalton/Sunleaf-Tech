<?php
session_start();

// CORS headers for React dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if session exists and user is logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        "authenticated" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "email" => $_SESSION['email'],
            "role" => $_SESSION['role'],
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["authenticated" => false]);
}
