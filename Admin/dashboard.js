document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

    if (!isLoggedIn || !adminId) {
        window.location.href = 'login.html';
        return;
    }

    const admin = db.findAdminById(parseInt(adminId));
    if (admin) {
        document.getElementById('admin-name-display').textContent = admin.name;
        document.getElementById('admin-role-display').textContent = admin.role === 'superAdmin' ? 'Super Administrator' : 'Administrator';

        // const avatar = document.getElementById('admin-avatar');
        // if (admin.name.includes('Seyf')) {
        //     avatar.src = 'https://randomuser.me/api/portraits/men/32.jpg';
        // } else if (admin.name.includes('Wail')) {
        //     avatar.src = 'https://randomuser.me/api/portraits/men/45.jpg';
        // } else {
        //     avatar.src = 'https://randomuser.me/api/portraits/men/22.jpg';
        // }
    }

    // document.getElementById('logout-link').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     localStorage.removeItem('adminLoggedIn');
    //     localStorage.removeItem('adminId');
    //     localStorage.removeItem('adminName');
    //     localStorage.removeItem('adminRole');

    //     sessionStorage.removeItem('adminLoggedIn');
    //     sessionStorage.removeItem('adminId');
    //     sessionStorage.removeItem('adminName');
    //     sessionStorage.removeItem('adminRole');

    //     window.location.href = 'login.html';
    // });
});