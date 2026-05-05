// Initialize map
const map = L.map('map').setView([17.3850, 78.4867], 14);

// Add tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Bus icon
const busIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Store markers for each driver
const driverMarkers = new Map();
const driverPaths = new Map(); // Store polylines for routes

// Socket.IO connection
const socket = io('http://localhost:3000');

// Connect to server
socket.on('connect', function() {
    console.log('Connected to tracking server');
    addLogEntry('Connected to real-time tracking server', 'success');
});

// Handle location updates
socket.on('locationUpdate', function(data) {
    console.log('Location update received:', data);
    updateDriverLocation(data);
});

// Handle connection errors
socket.on('connect_error', function(error) {
    console.error('Socket connection error:', error);
    addLogEntry('Connection to tracking server failed', 'error');
});

socket.on('disconnect', function() {
    console.log('Disconnected from tracking server');
    addLogEntry('Disconnected from tracking server', 'warning');
});

// Update driver location on map
function updateDriverLocation(locationData) {
    const { driverId, latitude, longitude, accuracy, timestamp } = locationData;

    // Create or update marker
    if (driverMarkers.has(driverId)) {
        // Update existing marker position smoothly
        const marker = driverMarkers.get(driverId);
        marker.setLatLng([latitude, longitude]);

        // Update popup content
        const accuracyText = accuracy ? ` (±${accuracy.toFixed(1)}m)` : '';
        marker.setPopupContent(`
            <b>Bus ${driverId}</b><br>
            Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}${accuracyText}<br>
            Last update: ${new Date(timestamp).toLocaleTimeString()}
        `);
    } else {
        // Create new marker
        const marker = L.marker([latitude, longitude], { icon: busIcon }).addTo(map);

        const accuracyText = accuracy ? ` (±${accuracy.toFixed(1)}m)` : '';
        marker.bindPopup(`
            <b>Bus ${driverId}</b><br>
            Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}${accuracyText}<br>
            Last update: ${new Date(timestamp).toLocaleTimeString()}
        `).openPopup();

        driverMarkers.set(driverId, marker);

        // Create path polyline for this driver
        const path = L.polyline([], { color: 'blue', weight: 3, opacity: 0.7 }).addTo(map);
        driverPaths.set(driverId, path);

        addLogEntry(`New bus ${driverId} appeared on map`, 'info');
    }

    // Update path (add new point to polyline)
    if (driverPaths.has(driverId)) {
        const path = driverPaths.get(driverId);
        const latlngs = path.getLatLngs();
        latlngs.push([latitude, longitude]);
        path.setLatLngs(latlngs);
    }

    // Center map on the updated location (optional, can be disabled for multiple drivers)
    if (driverMarkers.size === 1) {
        map.setView([latitude, longitude], 16);
    }

    // Update ETA calculation (mock implementation)
    updateETA(driverId, latitude, longitude);

    addLogEntry(`Bus ${driverId} location updated`, 'info');
}

// Update ETA display (mock calculation)
function updateETA(driverId, lat, lng) {
    // Mock destination (college main gate - replace with actual destination)
    const destination = [17.3850, 78.4867];
    const distance = calculateDistance(lat, lng, destination.lat || destination[0], destination.lng || destination[1]);

    // Estimate time based on distance (assuming 30 km/h average speed)
    const speedKmh = 30;
    const timeHours = distance / speedKmh;
    const timeMinutes = Math.round(timeHours * 60);

    const etaElement = document.getElementById('eta-time');
    const statusElement = document.querySelector('.bg-green-100');

    if (etaElement) {
        etaElement.textContent = `${timeMinutes} Minutes`;
    }

    if (statusElement && timeMinutes <= 5) {
        statusElement.className = statusElement.className.replace('bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700');
        statusElement.textContent = 'Arriving Soon';
    } else if (statusElement) {
        statusElement.className = statusElement.className.replace('bg-yellow-100 text-yellow-700', 'bg-green-100 text-green-700');
        statusElement.textContent = 'On Time';
    }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

// Add log entry to activity log (if exists)
function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('activity-log');
    if (!logContainer) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `text-sm mb-1 ${getLogColor(type)}`;
    logEntry.textContent = `[${timestamp}] ${message}`;

    logContainer.insertBefore(logEntry, logContainer.firstChild);

    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

function getLogColor(type) {
    switch (type) {
        case 'error': return 'text-red-600';
        case 'warning': return 'text-yellow-600';
        case 'success': return 'text-green-600';
        default: return 'text-slate-600';
    }
}

// Load initial driver locations on page load
async function loadInitialLocations() {
    try {
        const response = await fetch('http://localhost:3000/api/driver-locations');
        const data = await response.json();

        data.locations.forEach(location => {
            updateDriverLocation(location);
        });

        addLogEntry(`Loaded ${data.locations.length} active drivers`, 'success');
    } catch (error) {
        console.error('Failed to load initial locations:', error);
        addLogEntry('Failed to load initial driver locations', 'error');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tracking page initialized');
    addLogEntry('Map initialized and ready for tracking', 'success');

    // Load existing driver locations
    setTimeout(loadInitialLocations, 1000);
});

// Handle page visibility (optional reconnection logic)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible - refreshing locations');
        // Optionally refresh locations when page becomes visible
        loadInitialLocations();
    }
});