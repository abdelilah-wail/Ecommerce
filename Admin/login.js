document.addEventListener('DOMContentLoaded', function () {
    checkExistingSession();
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function checkExistingSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        window.location.href = 'dashboard.html';
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const admin = db.findAdminByEmail(email);

        if (!admin) {
            showError('Invalid email or password');
            return;
        }

        if (admin.status !== 'active') {
            showError('Your account is not active. Please contact the super admin.');
            return;
        }

        if (password !== admin.password) {
            showError('Invalid email or password');
            return;
        }

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('adminLoggedIn', 'true');
        storage.setItem('adminId', admin.id.toString());
        storage.setItem('adminName', admin.name);
        storage.setItem('adminRole', admin.role);

        db.updateAdmin(admin.id, { lastLogin: new Date() });

        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message);
    }
}