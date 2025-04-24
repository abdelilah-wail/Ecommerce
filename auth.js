// auth.js

// Check if user is logged in
export function isLoggedIn() {
    return localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
}

// Get current user data
export function getCurrentUser() {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Logout function
export function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html'; // Redirect to login page
}

// Save user session after login
export function saveUserSession(user, rememberMe = false) {
    const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        profileImage: user.profileImage || 'images/icons/profile.svg',
        role: user.role || 'customer'
    };

    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    }
}
