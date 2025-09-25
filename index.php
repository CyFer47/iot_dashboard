<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IoT Dashboard</title>
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>IoT Dashboard</h1>
            <div class="status-indicator" id="connection-status">
                <span class="status-dot"></span>
                <span>Connecting...</span>
            </div>
        </header>

        <div class="dashboard-grid">
            <!-- Current Readings -->
            <div class="card">
                <h2>Current Readings</h2>
                <div class="readings-grid">
                    <div class="reading-item">
                        <div class="reading-label">Temperature</div>
                        <div class="reading-value" id="temperature-value">--°C</div>
                    </div>
                    <div class="reading-item">
                        <div class="reading-label">Humidity</div>
                        <div class="reading-value" id="humidity-value">--%</div>
                    </div>
                </div>
            </div>

            <!-- LED Control -->
            <div class="card">
                <h2>LED Control</h2>
                <div class="control-section">
                    <label class="switch">
                        <input type="checkbox" id="led-toggle">
                        <span class="slider"></span>
                    </label>
                    <span id="led-status-text">OFF</span>
                </div>
            </div>

            <!-- Chart -->
            <div class="card chart-card">
                <h2>Temperature & Humidity Trends</h2>
                <canvas id="sensor-chart"></canvas>
            </div>

            <!-- Recent Data -->
            <div class="card">
                <h2>Recent Data</h2>
                <div class="data-table-container">
                    <table id="recent-data-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Temp (°C)</th>
                                <th>Humidity (%)</th>
                                <th>LED</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/dashboard.js"></script>
</body>
</html>
