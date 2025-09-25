// Dashboard JavaScript
class IoTDashboard {
    constructor() {
        this.updateInterval = null;
        this.chart = null;
        this.isConnected = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initChart();
        this.startDataUpdates();
        this.updateConnectionStatus(false);
    }

    setupEventListeners() {
        // LED toggle event
        document.getElementById('led-toggle').addEventListener('change', (e) => {
            this.updateLEDStatus(e.target.checked);
        });

        // Page visibility API to pause updates when tab is not active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopDataUpdates();
            } else {
                this.startDataUpdates();
            }
        });
    }

    initChart() {
        const ctx = document.getElementById('sensor-chart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#e53e3e',
                    backgroundColor: 'rgba(229, 62, 62, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: '#3182ce',
                    backgroundColor: 'rgba(49, 130, 206, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    async fetchSensorData() {
        try {
            const response = await fetch('api/get_sensor_data.php');
            const result = await response.json();

            if (result.success) {
                this.updateConnectionStatus(true);
                this.updateDisplays(result.data);
                return result.data;
            } else {
                console.error('API Error:', result.message);
                this.updateConnectionStatus(false);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            this.updateConnectionStatus(false);
        }
    }

    updateDisplays(data) {
        const current = data.current;
        
        // Update current readings
        document.getElementById('temperature-value').textContent = `${current.temperature}°C`;
        document.getElementById('humidity-value').textContent = `${current.humidity}%`;
        
        // Update LED status
        document.getElementById('led-toggle').checked = current.led_status == 1;
        document.getElementById('led-status-text').textContent = current.led_status == 1 ? 'ON' : 'OFF';
        
        // Update chart
        this.updateChart(data.chart_data);
        
        // Update recent data table
        this.updateDataTable(data.chart_data);
    }

    updateChart(chartData) {
        const labels = chartData.map(item => item.time);
        const temperatures = chartData.map(item => parseFloat(item.temperature));
        const humidity = chartData.map(item => parseFloat(item.humidity));

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = temperatures;
        this.chart.data.datasets[1].data = humidity;
        this.chart.update('none'); // No animation for smoother updates
    }

    updateDataTable(data) {
        const tbody = document.querySelector('#recent-data-table tbody');
        tbody.innerHTML = '';

        data.slice(0, 5).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.time}</td>
                <td>${row.temperature}</td>
                <td>${row.humidity}</td>
                <td><span class="led-indicator ${row.led_status == 1 ? 'on' : 'off'}">${row.led_status == 1 ? 'ON' : 'OFF'}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    async updateLEDStatus(isOn) {
        try {
            const response = await fetch('api/update_led_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    led_status: isOn ? 1 : 0,
                    device_id: 'ESP32_001'
                })
            });

            const result = await response.json();

            if (result.success) {
                document.getElementById('led-status-text').textContent = isOn ? 'ON' : 'OFF';
                console.log('LED status updated successfully');
            } else {
                console.error('Failed to update LED status:', result.message);
                // Revert toggle if failed
                document.getElementById('led-toggle').checked = !isOn;
            }
        } catch (error) {
            console.error('Error updating LED status:', error);
            // Revert toggle if failed
            document.getElementById('led-toggle').checked = !isOn;
        }
    }

    updateConnectionStatus(connected) {
        this.isConnected = connected;
        const statusIndicator = document.getElementById('connection-status');
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = statusIndicator.querySelector('span:last-child');

        if (connected) {
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected';
        } else {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Disconnected';
        }
    }

    startDataUpdates() {
        // Initial fetch
        this.fetchSensorData();
        
        // Set up interval for regular updates
        this.updateInterval = setInterval(() => {
            this.fetchSensorData();
        }, 5000); // Update every 5 seconds
    }

    stopDataUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IoTDashboard();
});

// Utility functions for manual testing
window.simulateSensorData = function(temp, humidity, ledStatus = 0) {
    fetch('api/update_sensor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temperature: temp,
            humidity: humidity,
            led_status: ledStatus,
            device_id: 'MANUAL_TEST'
        })
    })
    .then(response => response.json())
    .then(data => console.log('Manual data sent:', data))
    .catch(error => console.error('Error:', error));
};
