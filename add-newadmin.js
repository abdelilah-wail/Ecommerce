document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-newadmin-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('admin-name').value.trim();
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value.trim();
        const role = document.getElementById('admin-role').value.trim();
        const status = document.getElementById('admin-status').value.trim();

        // Validate required fields
        if (!name || !email || !password || !role || !status) {
            alert('Please fill in all required fields.');
            return;
        }

        // Retrieve existing admins from localStorage
        const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin')) || { admins: [] };

        // Check for duplicate email
        const isDuplicateEmail = dbAdminData.admins.some(admin => admin.email === email);
        if (isDuplicateEmail) {
            alert('An admin with this email already exists.');
            return;
        }

        // Create new admin object
        const newAdmin = {
            id: dbAdminData.admins[dbAdminData.admins.length - 1].id + 1,
            name,
            email,
            password,
            status,
            role,
            address: null,
            phone: null,
            image: 'images/avatar/default-avatar.png',
            createdAt: new Date().toISOString(),
            lastLogin: null,
        };

        // Add new admin to the list
        dbAdminData.admins.push(newAdmin);

        // Save updated admins to localStorage
        localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));

        // Get existing admins from localStorage
        const dbAdmins = JSON.parse(localStorage.getItem('dbAdmin'));
        // update the users in localStorage as well
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
        console.log(combinedUsers);


        alert('New admin added successfully!');
    });
});