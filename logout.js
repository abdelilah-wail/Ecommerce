document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Clear storage
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminId');
            localStorage.removeItem('adminName');
            localStorage.removeItem('adminRole');
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminId');
            sessionStorage.removeItem('adminName');
            sessionStorage.removeItem('adminRole');

            // go to login page
            window.location.href = 'login.html';
        });
    }
});