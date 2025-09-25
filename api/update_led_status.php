<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, "Only POST requests allowed");
}

$conn = getDBConnection();

$input = json_decode(file_get_contents('php://input'), true);
$led_status = isset($input['led_status']) ? intval($input['led_status']) : 0;
$device_id = isset($input['device_id']) ? $input['device_id'] : 'ESP32_001';

// Update device settings
$stmt = $conn->prepare("INSERT INTO device_settings (device_id, setting_name, setting_value) 
                        VALUES (?, 'led_status', ?) 
                        ON DUPLICATE KEY UPDATE 
                        setting_value = VALUES(setting_value)");
$stmt->bind_param("ss", $device_id, $led_status);

if ($stmt->execute()) {
    sendResponse(true, ['led_status' => $led_status], "LED status updated");
} else {
    sendResponse(false, null, "Failed to update LED status");
}

$stmt->close();
$conn->close();
?>
