document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

    if (!isLoggedIn || !adminId) {
        window.location.href = 'login.html';
        return;
    }
});