<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, "Only POST requests allowed");
}

$conn = getDBConnection();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['temperature', 'humidity'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || !is_numeric($input[$field])) {
        sendResponse(false, null, "Missing or invalid field: $field");
    }
}

$temperature = floatval($input['temperature']);
$humidity = floatval($input['humidity']);
$led_status = isset($input['led_status']) ? intval($input['led_status']) : 0;
$device_id = isset($input['device_id']) ? $input['device_id'] : 'ESP32_001';

// Validate ranges
if ($temperature < -50 || $temperature > 100) {
    sendResponse(false, null, "Temperature out of valid range (-50 to 100)");
}

if ($humidity < 0 || $humidity > 100) {
    sendResponse(false, null, "Humidity out of valid range (0 to 100)");
}

// Insert data
$stmt = $conn->prepare("INSERT INTO sensor_readings (temperature, humidity, led_status, device_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ddis", $temperature, $humidity, $led_status, $device_id);

if ($stmt->execute()) {
    sendResponse(true, [
        'id' => $conn->insert_id,
        'temperature' => $temperature,
        'humidity' => $humidity,
        'led_status' => $led_status
    ], "Data saved successfully");
} else {
    sendResponse(false, null, "Database error: " . $stmt->error);
}

$stmt->close();
$conn->close();
?>
