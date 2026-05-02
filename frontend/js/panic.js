document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    const panicBtn = document.getElementById('emergencyPanicBtn');

    if (role === 'admin' && panicBtn) {
        panicBtn.style.display = 'none';
    }
});

function triggerPanic() {
    const apiBase = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '') ? 'http://localhost:3000/api' : '/api';
    const role = localStorage.getItem('userRole') || 'User';
    const userName = localStorage.getItem('userName') || 'Unknown User';
    const userId = localStorage.getItem('userId') || null;

    console.log('[PANIC] Triggered by:', { role, userName, userId, apiBase });

    if (role !== 'student' && role !== 'driver') {
        alert('Only students and drivers can trigger panic alerts!');
        return;
    }

    if (!confirm('🚨 EMERGENCY!\n\nAre you sure you want to send an SOS alert to the College Administration and Parents?')) {
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const panicAlert = {
            userId: userId ? Number(userId) : null,
            userName,
            role,
            message: `🚨 EMERGENCY ALERT: ${role.toUpperCase()} sent an SOS request!`,
            latitude: lat,
            longitude: lng,
            locationText: `Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`
        };

        console.log('[PANIC] Sending alert:', panicAlert);

        try {
            const response = await fetch(`${apiBase}/panic-alerts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(panicAlert)
            });
            const result = await response.json();
            
            console.log('[PANIC] Response status:', response.status);
            console.log('[PANIC] Response data:', result);
            
            if (!response.ok) throw new Error(result.message || 'Unable to send panic alert.');

            alert(`✅ SOS BROADCASTED!\nRole: ${role.toUpperCase()}\nName: ${userName}\nLocation: ${lat.toFixed(4)}, ${lng.toFixed(4)}\n\nHelp is being dispatched.`);
        } catch (error) {
            console.error('[PANIC ERROR]', error);
            alert(error.message);
        }
    }, (error) => {
        alert('Unable to get location. Please enable location services and try again.');
        console.error('Geolocation error:', error);
    });
}