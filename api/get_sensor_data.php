<?php
require_once 'config.php';

$conn = getDBConnection();

// Get latest sensor reading
$sql = "SELECT temperature, humidity, led_status, timestamp 
        FROM sensor_readings 
        ORDER BY timestamp DESC 
        LIMIT 1";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    
    // Get recent data for chart (last 10 readings)
    $chart_sql = "SELECT temperature, humidity, 
                         DATE_FORMAT(timestamp, '%H:%i') as time 
                  FROM sensor_readings 
                  ORDER BY timestamp DESC 
                  LIMIT 10";
    
    $chart_result = $conn->query($chart_sql);
    $chart_data = [];
    
    while ($row = $chart_result->fetch_assoc()) {
        $chart_data[] = $row;
    }
    
    // Reverse array to show chronological order
    $chart_data = array_reverse($chart_data);
    
    sendResponse(true, [
        'current' => $data,
        'chart_data' => $chart_data
    ]);
} else {
    sendResponse(false, null, "No sensor data found");
}

$conn->close();
?>
