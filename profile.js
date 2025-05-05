document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

    if (!isLoggedIn || !adminId) {
        window.location.href = 'login.html';
        return;
    }

    // Retrieve admin data from localStorage
    const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin'));
    const adminData = dbAdminData.admins.find(admin => admin.id === parseInt(adminId));

    if (adminData) {
        // Populate profile fields
        document.getElementById('name').value = adminData.name;
        document.getElementById('email').value = adminData.email;
        document.getElementById('address').value = adminData.address;
        document.getElementById('phone').value = adminData.phone;
    }

    // Save profile changes
    const saveProfileButton = document.getElementById('save-profile');
    saveProfileButton.addEventListener('click', function () {
        const updatedName = document.getElementById('name').value.trim();
        const updatedEmail = document.getElementById('email').value.trim();
        const updatedAddress = document.getElementById('address').value.trim();
        const updatedPhone = document.getElementById('phone').value.trim();

        if (!updatedName || !updatedEmail || !updatedAddress || !updatedPhone) {
            alert('All fields are required.');
            return;
        }

        // Update admin in dbAdmin
        const adminIndex = dbAdminData.admins.findIndex(admin => admin.id === parseInt(adminId));
        if (adminIndex !== -1) {
            dbAdminData.admins[adminIndex] = {
                ...dbAdminData.admins[adminIndex],
                name: updatedName,
                email: updatedEmail,
                address: updatedAddress,
                phone: updatedPhone,
            };

            // Save updated admin data to localStorage
            localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));

            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile. Please try again.');
        }
    });
});