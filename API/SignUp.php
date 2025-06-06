<?php
header("Access-Control-Allow-Origin: http://localhost:5173");

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $first_name = $data["firstName"];
    $second_name = $data["secondName"];
    $email = $data["email"];
    $password = password_hash($data["password"], PASSWORD_DEFAULT);

    // Check for duplicate email
    $checkSql = "SELECT * FROM users WHERE email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        echo "Email already exists";
        exit;
    }

    // Insert into DB
    $sql = "INSERT INTO users (First_name, Second_name, email, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $first_name, $second_name, $email, $password);
    
    if ($stmt->execute()) {
        echo "Signup successful";
    } else {
        echo "Signup failed";
    }
}
