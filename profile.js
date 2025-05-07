document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

    if (!isLoggedIn || !adminId) {
        window.location.href = 'login.html';
        return;
    }

    // get admin data
    const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin'));
    const adminData = dbAdminData.admins.find(admin => admin.id === parseInt(adminId));

    // set notif
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container fixed top-4 right-4 z-50';
        document.body.appendChild(notificationContainer);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification px-4 py-3 rounded shadow-md mb-4 ${type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
            }`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    if (adminData) {
        document.getElementById('name').value = adminData.name;
        document.getElementById('email').value = adminData.email;
        document.getElementById('address').value = adminData.address;
        document.getElementById('phone').value = adminData.phone;
        document.getElementById('current-password').value = adminData.password;
    }

    // save change
    const saveProfileButton = document.getElementById('save-profile');
    saveProfileButton.addEventListener('click', function () {
        const updatedName = document.getElementById('name').value.trim();
        const updatedEmail = document.getElementById('email').value.trim();
        const updatedAddress = document.getElementById('address').value.trim();
        const updatedPhone = document.getElementById('phone').value.trim();

        if (!updatedName || !updatedEmail || !updatedAddress || !updatedPhone) {
            showNotification('All fields are required.', 'error');
            return;
        }

        // save data
        const adminIndex = dbAdminData.admins.findIndex(admin => admin.id === parseInt(adminId));
        if (adminIndex !== -1) {
            dbAdminData.admins[adminIndex] = {
                ...dbAdminData.admins[adminIndex],
                name: updatedName,
                email: updatedEmail,
                address: updatedAddress,
                phone: updatedPhone,
            };

            localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));

            showNotification('Profile updated successfully!', 'success');
        } else {
            showNotification('Failed to update profile. Please try again.', 'error');
        }
    });

    // password
    const changePasswordButton = document.getElementById('change-password');
    changePasswordButton.addEventListener('click', function () {
        const currentPassword = document.getElementById('current-password').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('All password fields are required.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('New password and confirm password do not match.', 'error');
            return;
        }

        if (adminData.password !== currentPassword) {
            showNotification('Current password is incorrect.', 'error');
            return;
        }

        if (newPassword === currentPassword && confirmPassword === currentPassword) {
            showNotification('New password cannot be the same as current password.', 'error');
            return;
        }

        // save password
        const adminIndex = dbAdminData.admins.findIndex(admin => admin.id === parseInt(adminId));
        if (adminIndex !== -1) {
            dbAdminData.admins[adminIndex].password = newPassword;

            localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));

            showNotification('Password changed successfully!', 'success');

            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            showNotification('Failed to change password. Please try again.', 'error');
        }

        window.location.reload();

    });

    // show/hide
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const isPasswordVisible = input.type === 'text';
            input.type = isPasswordVisible ? 'password' : 'text';
            this.textContent = isPasswordVisible ? 'Show' : 'Hide';
        });
    });
});