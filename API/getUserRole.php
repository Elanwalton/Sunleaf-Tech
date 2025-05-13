<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if (isset($_SESSION['role'])) {
    echo json_encode([
    "role" => $_SESSION['role'],
    'email' => $_SESSION['user']['email'],
    'id' => $_SESSION['user']['id']]);
} else {
    echo json_encode(["role" => null]);
}


