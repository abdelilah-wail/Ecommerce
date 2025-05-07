document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-newadmin-form');

    //! notification
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container fixed top-4 right-4 z-50';
        document.body.appendChild(notificationContainer);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification px-4 py-3 rounded shadow-md mb-4 ${
            type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('admin-name').value.trim();
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value.trim();
        const role = document.getElementById('admin-role').value.trim();
        const status = document.getElementById('admin-status').value.trim();

        if (!name || !email || !password || !role || !status) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin')) || { admins: [] };

        const isDuplicateEmail = dbAdminData.admins.some(admin => admin.email === email);
        if (isDuplicateEmail) {
            showNotification('An admin with this email already exists.', 'error');
            return;
        }

        const newAdmin = {
            id: dbAdminData.admins.length > 0 ? dbAdminData.admins[dbAdminData.admins.length - 1].id + 1 : 1,
            name,
            email,
            password,
            status: status === 'blocked' ? 'blocked' : status,
            role,
            address: null,
            phone: null,
            image: 'images/avatar/default-avatar.png',
            createdAt: new Date().toISOString(),
            lastLogin: null,
        };

        dbAdminData.admins.push(newAdmin);

        localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));

        // update
        const dbAdmins = JSON.parse(localStorage.getItem('dbAdmin'));
        const combinedUsers = [...dbUsers.users, ...dbAdmins.admins.map(admin => ({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            password: admin.password,
            status: admin.status,
            role: admin.role,
            address: admin.address,
            phone: admin.phone,
            image: admin.image || 'images/avatar/default-avatar.png',
            createdAt: admin.createdAt,
            lastLogin: admin.lastLogin
        }))];
        localStorage.setItem('users', JSON.stringify(combinedUsers));

        showNotification('New admin added successfully!', 'success');

        form.reset();

        setTimeout(() => {
            window.location.href = 'users.html';
        }, 2000);
    });
});