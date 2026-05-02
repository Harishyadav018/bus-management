const apiBase = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '') ? 'http://localhost:3000/api' : '/api';
const routeForm = document.getElementById('routeForm');
const routesBody = document.querySelector('tbody');

async function loadRoutes() {
    if (!routesBody) return;

    try {
        const response = await fetch(`${apiBase}/routes`);
        const routes = await response.json();

        if (!response.ok) {
            throw new Error(routes.message || 'Unable to load routes');
        }

        routesBody.innerHTML = routes.map(route => `
            <tr>
                <td class="p-4">
                    <div class="font-bold">${route.routeName}</div>
                    <div class="text-xs text-gray-400">Bus: ${route.busNumber || 'N/A'}</div>
                </td>
                <td class="p-4 text-sm">${route.driverName || 'No driver assigned yet'}</td>
                <td class="p-4">
                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">Active</span>
                </td>
                <td class="p-4">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-3"><i class="fas fa-edit"></i></button>
                    <button class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error(error);
    }
}

if (routeForm) {
    routeForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const routeName = document.getElementById('routeName').value.trim();
        const busNumber = document.getElementById('busNumber').value.trim();
        const driverName = document.getElementById('driverName').value.trim();

        if (!routeName) {
            return alert('Please enter a route name.');
        }

        try {
            const response = await fetch(`${apiBase}/routes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ routeName, busNumber, driverName })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to save route.');
            }

            alert(result.message);
            routeForm.reset();
            loadRoutes();
        } catch (error) {
            alert(error.message);
        }
    });
}

loadRoutes();