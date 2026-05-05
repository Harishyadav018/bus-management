// Test script to simulate GPS location updates
// Run this in browser console or as a separate script

const BACKEND_URL = 'http://localhost:3000';
const DRIVER_ID = 'test_driver_001';

// Simulate GPS coordinates around BV Raju Institute (Hyderabad, India)
const baseLocation = { lat: 17.3850, lng: 78.4867 };
let currentIndex = 0;

// Generate mock GPS path (simple circular route)
function generateMockLocations() {
    const locations = [];
    const radius = 0.005; // ~500 meters radius
    const points = 20;

    for (let i = 0; i < points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        const lat = baseLocation.lat + radius * Math.sin(angle);
        const lng = baseLocation.lng + radius * Math.cos(angle);
        locations.push({ lat, lng });
    }

    return locations;
}

const mockLocations = generateMockLocations();

// Send location update
async function sendLocationUpdate(lat, lng) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/update-location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driverId: DRIVER_ID,
                latitude: lat,
                longitude: lng,
                accuracy: Math.random() * 20 + 5, // 5-25 meters accuracy
                timestamp: new Date().toISOString()
            })
        });

        const result = await response.json();
        console.log(`[${new Date().toLocaleTimeString()}] Location sent:`, result);
        return response.ok;
    } catch (error) {
        console.error('Error sending location:', error);
        return false;
    }
}

// Simulate driver movement
function startSimulation() {
    console.log('Starting GPS simulation...');

    const interval = setInterval(async () => {
        if (currentIndex >= mockLocations.length) {
            currentIndex = 0; // Loop back to start
        }

        const location = mockLocations[currentIndex];
        const success = await sendLocationUpdate(location.lat, location.lng);

        if (success) {
            console.log(`Moved to: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
        }

        currentIndex++;
    }, 3000); // Update every 3 seconds

    // Stop after 2 minutes for testing
    setTimeout(() => {
        clearInterval(interval);
        console.log('Simulation stopped');
    }, 120000);

    return interval;
}

// Test single location update
async function testSingleUpdate() {
    console.log('Testing single location update...');
    await sendLocationUpdate(baseLocation.lat, baseLocation.lng);
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
    window.testGPSTracking = {
        startSimulation,
        testSingleUpdate,
        sendLocationUpdate
    };
    console.log('GPS Test functions available:');
    console.log('- testGPSTracking.startSimulation() - Start moving simulation');
    console.log('- testGPSTracking.testSingleUpdate() - Send single location');
}

module.exports = { startSimulation, testSingleUpdate, sendLocationUpdate };