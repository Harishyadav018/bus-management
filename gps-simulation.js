// Simple Node.js GPS simulation script
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BACKEND_URL = 'http://localhost:3000';
const DRIVER_ID = 'simulated_driver';

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

// Simple Node.js GPS simulation script
const http = require('http');

// Send location update
async function sendLocationUpdate(lat, lng) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            driverId: DRIVER_ID,
            latitude: lat,
            longitude: lng,
            accuracy: Math.random() * 20 + 5, // 5-25 meters accuracy
            timestamp: new Date().toISOString()
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/update-location',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    console.log(`[${new Date().toLocaleTimeString()}] Location sent: ${lat.toFixed(6)}, ${lng.toFixed(6)} - ${result.message}`);
                    resolve(res.statusCode === 200);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error sending location:', error);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

// Simulate driver movement
async function startSimulation() {
    console.log('🚍 Starting GPS simulation for driver:', DRIVER_ID);
    console.log('📍 Route: Circular path around BV Raju Institute');

    const interval = setInterval(async () => {
        if (currentIndex >= mockLocations.length) {
            currentIndex = 0; // Loop back to start
        }

        const location = mockLocations[currentIndex];
        await sendLocationUpdate(location.lat, location.lng);
        currentIndex++;
    }, 3000); // Update every 3 seconds

    // Stop after 2 minutes for demo
    setTimeout(() => {
        clearInterval(interval);
        console.log('🛑 Simulation stopped after 2 minutes');
    }, 120000);

    return interval;
}

// Run simulation
startSimulation().catch(console.error);