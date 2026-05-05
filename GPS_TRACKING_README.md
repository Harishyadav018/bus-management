# GPS Live Tracking System - Setup Guide

## Overview
Complete real-time GPS tracking system for the College Bus Management System with Socket.IO for instant updates.

## Features
- ✅ Real-time GPS location tracking from drivers
- ✅ Socket.IO instant broadcasting to all clients
- ✅ Leaflet map with smooth marker updates
- ✅ Route path visualization
- ✅ ETA calculation based on distance
- ✅ Accuracy filtering (>50m locations ignored)
- ✅ Error handling and retry logic
- ✅ Start/Stop tracking controls

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install  # Installs Socket.IO
npm start    # Starts server with GPS tracking
```

### 2. Frontend Files
- **Driver Tracking**: `frontend/driver-tracking.html`
- **Student/Parent/Admin View**: `frontend/tracking.html`
- **Updated JS**: `frontend/js/tracking.js`

### 3. Testing the System

#### Option A: Use Real GPS (Driver)
1. Open `frontend/driver-tracking.html` in browser
2. Allow location permissions
3. Click "Start Tracking"
4. GPS coordinates will be sent every 3 seconds

#### Option B: Simulate GPS Movement
1. Open browser console on any page
2. Load the test script:
```javascript
// Copy and paste this in console:
const script = document.createElement('script');
script.src = 'test-gps.js';
document.head.appendChild(script);
```
3. Run simulation:
```javascript
testGPSTracking.startSimulation();  // Starts moving bus simulation
```

#### Option C: Manual Testing
```javascript
// Send single location update
fetch('http://localhost:3000/api/update-location', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    driverId: 'test_driver',
    latitude: 17.3850,
    longitude: 78.4867,
    accuracy: 10
  })
});
```

## API Endpoints

### POST /api/update-location
Send driver GPS location updates.

**Request Body:**
```json
{
  "driverId": "string",
  "latitude": "number",
  "longitude": "number",
  "accuracy": "number (optional)",
  "timestamp": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Location updated successfully."
}
```

### GET /api/driver-locations
Get current locations of all active drivers.

**Response:**
```json
{
  "locations": [
    {
      "driverId": "string",
      "latitude": "number",
      "longitude": "number",
      "accuracy": "number",
      "timestamp": "string",
      "lastUpdate": "number"
    }
  ]
}
```

## Socket.IO Events

### Client Events
- `locationUpdate` - Fired when any driver location updates
  ```javascript
  socket.on('locationUpdate', (data) => {
    console.log('New location:', data);
  });
  ```

## Configuration

### Driver Settings
- **Update Interval**: 3 seconds (configurable in driver-tracking.html)
- **Accuracy Threshold**: 50 meters (locations with worse accuracy ignored)
- **Driver ID**: Currently hardcoded as 'driver_001' (implement auth for production)

### Map Settings
- **Default Center**: BV Raju Institute coordinates (17.3850, 78.4867)
- **Zoom Level**: 14 (auto-adjusts to 16 when tracking single driver)
- **Tile Layer**: Carto Voyager (free, no API key required)

## Production Considerations

### Scalability
- Replace in-memory storage with Redis
- Implement proper authentication (JWT)
- Add rate limiting
- Use load balancer for multiple server instances

### Security
- Validate all input data
- Implement HTTPS
- Add API key authentication
- Rate limit location updates per driver

### Performance
- Optimize map rendering for multiple drivers
- Implement location data compression
- Add database indexing for location queries
- Use WebSockets compression

## Troubleshooting

### Backend Issues
- Check if port 3000 is available
- Verify MySQL connection
- Check Socket.IO logs in console

### Frontend Issues
- Ensure location permissions granted
- Check browser console for errors
- Verify Socket.IO connection

### GPS Issues
- Test with browser dev tools location override
- Check network connectivity
- Verify GPS accuracy settings

## File Structure
```
backend/
├── server.js          # Updated with Socket.IO
├── package.json       # Added socket.io dependency
└── ...

frontend/
├── driver-tracking.html    # New driver GPS interface
├── tracking.html           # Updated with real-time tracking
├── js/
│   └── tracking.js         # Updated with Socket.IO
└── ...

test-gps.js                 # GPS simulation script
```