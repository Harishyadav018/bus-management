document.addEventListener('DOMContentLoaded', () => {
    const apiBase = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '') ? 'http://localhost:3000/api' : '/api';
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerRole = document.getElementById('registerRole');

    function showLoginTab() {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('bg-indigo-600', 'text-white');
        loginTab.classList.remove('bg-slate-200', 'text-slate-700');
        registerTab.classList.remove('bg-indigo-600', 'text-white');
        registerTab.classList.add('bg-slate-200', 'text-slate-700');
    }

    function showRegisterTab() {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerTab.classList.add('bg-indigo-600', 'text-white');
        registerTab.classList.remove('bg-slate-200', 'text-slate-700');
        loginTab.classList.remove('bg-indigo-600', 'text-white');
        loginTab.classList.add('bg-slate-200', 'text-slate-700');
    }

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', showLoginTab);
        registerTab.addEventListener('click', showRegisterTab);
    }

    if (registerRole) {
        registerRole.addEventListener('change', (e) => {
            const role = e.target.value;
            document.getElementById('studentFields').classList.toggle('hidden', role !== 'student');
            document.getElementById('parentFields').classList.toggle('hidden', role !== 'parent');
            document.getElementById('driverFields').classList.toggle('hidden', role !== 'driver');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const role = document.getElementById('userRole').value;
            const email = document.getElementById('loginEmail').value.toLowerCase();
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${apiBase}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role, email, password })
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Login failed.');
                }

                localStorage.setItem('userId', result.id);
                localStorage.setItem('userRole', result.role);
                localStorage.setItem('userName', result.name);
                localStorage.setItem('userEmail', result.email);

                if (role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else if (role === 'parent') {
                    window.location.href = 'parent-dashboard.html';
                } else if (role === 'driver') {
                    window.location.href = 'driver-dashboard.html';
                } else {
                    window.location.href = 'tracking.html';
                }
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const role = document.getElementById('registerRole').value;
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.toLowerCase().trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const studentId = document.getElementById('studentId').value.trim();
            const childName = document.getElementById('childName').value.trim();
            const licenseNumber = document.getElementById('licenseNumber').value.trim();

            if (!role) {
                alert('Please select a role.');
                return;
            }

            if (!name) {
                alert('Please enter your full name.');
                return;
            }

            if (!email) {
                alert('Please enter a valid email address.');
                return;
            }

            if (!phone) {
                alert('Please enter your phone number.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }

            if (role === 'student' && !studentId) {
                alert('Please enter your roll number/ID.');
                return;
            }

            if (role === 'parent' && !childName) {
                alert('Please enter your child\'s name.');
                return;
            }

            if (role === 'driver' && !licenseNumber) {
                alert('Please enter your license number.');
                return;
            }

            try {
                const response = await fetch(`${apiBase}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        role,
                        name,
                        email,
                        phone,
                        password,
                        studentId: role === 'student' ? studentId : null,
                        childName: role === 'parent' ? childName : null,
                        licenseNumber: role === 'driver' ? licenseNumber : null
                    })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Registration failed.');
                }

                alert('Registration submitted successfully! Please wait for admin approval.');
                registerForm.reset();
                showLoginTab();
            } catch (error) {
                alert(error.message);
            }
        });
    }
});
