document.addEventListener('DOMContentLoaded', function () {
    const usersTableBody = document.querySelector('.scrollable-users tbody');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const statusFilter = document.querySelector('select#statusFilter');
    const roleFilter = document.querySelector('select#roleFilter');

    //! notification
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

    if (usersTableBody) {
        //! najma3ou
        if (!localStorage.getItem('users')) {
            const combinedUsers = [...dbUsers.users, ...dbAdmin.admins.map(admin => ({
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
        }

        //! get users
        let users = JSON.parse(localStorage.getItem('users'));


        const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

        //! access
        const currentUser = users.find(user => String(user.id) === String(adminId));
        console.log("Current User:", currentUser);
        if (currentUser) {
            if (currentUser.role === 'superAdmin') {
                users = users.filter(user => user.id !== currentUser.id);
            } else if (currentUser.role === 'admin') {
                users = users.filter(user => user.role === 'customer');
            } else {
                users = [];
            }
        }

        //! rnder
        function renderUsers(filteredUsers) {
            if (filteredUsers.length === 0) {
                usersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4 text-gray-500">
                            No users found matching the selected filters.
                        </td>
                    </tr>
                `;
                searchResults.innerHTML = `Showing <span class="font-medium">0</span> results`;
                return;
            }

            usersTableBody.innerHTML = filteredUsers.map(user => {
                let statusLabel = '';
                let statusClasses = '';

                if (user.status === 'blocked') {
                    statusLabel = 'Blocked';
                    statusClasses = 'bg-red-100 text-red-800';
                } else if (user.status === 'active') {
                    statusLabel = 'Active';
                    statusClasses = 'bg-green-100 text-green-800';
                }

                return `
                    <tr data-id="${user.id}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <img class="h-10 w-10 rounded-full" src="${user.image}" alt="${user.name}" onerror="this.onerror=null; this.src='images/avatar/default-avatar.png';">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${user.name}</div>
                                    <div class="text-sm text-gray-500">Registered: ${new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">${user.role}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}">
                                ${statusLabel}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="delete-btn text-blue-600 hover:text-blue-900 mr-2">Delete</button>
                            <button class="block-btn ${user.status === 'blocked' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}">
                                ${user.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            searchResults.innerHTML = `Showing <span class="font-medium">${filteredUsers.length}</span> results`;
        }

        renderUsers(users);

        //! Filter
        function applyFilters() {
            const searchKeyword = searchInput.value.toLowerCase();
            const selectedStatus = statusFilter.value;
            const selectedRole = roleFilter.value;

            let filteredUsers = [...users];

            if (searchKeyword) {
                filteredUsers = filteredUsers.filter(user =>
                    user.name.toLowerCase().includes(searchKeyword) ||
                    user.email.toLowerCase().includes(searchKeyword)
                );
            }

            if (selectedStatus !== 'All Status') {
                filteredUsers = filteredUsers.filter(user => user.status === selectedStatus.toLowerCase());
            }

            if (selectedRole !== 'All Roles') {
                filteredUsers = filteredUsers.filter(user => user.role === selectedRole.toLowerCase());
            }

            renderUsers(filteredUsers);
        }

        searchInput.addEventListener('input', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        roleFilter.addEventListener('change', applyFilters);

        //! block/unblock and delete
        usersTableBody.addEventListener('click', function (e) {
            const row = e.target.closest('tr');
            const userId = parseInt(row.dataset.id, 10);

            if (e.target.classList.contains('block-btn')) {
                const index = users.findIndex(user => user.id === userId);
                if (index !== -1) {
                    users[index].status = users[index].status === 'blocked' ? 'active' : 'blocked';

                    localStorage.setItem('users', JSON.stringify(users));

                    renderUsers(users);

                    showNotification(`User ${users[index].status === 'blocked' ? 'blocked' : 'unblocked'} successfully.`, 'success');
                }
            }

            if (e.target.classList.contains('delete-btn')) {
                const confirmDelete = confirm('Are you sure you want to delete this user?');
                if (confirmDelete) {
                    const index = users.findIndex(user => user.id === userId);
                    if (index !== -1) {
                        if (users[index].role === 'admin') {
                            const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin')) || { admins: [] };
                            const adminIndex = dbAdminData.admins.findIndex(admin => admin.id === userId);
                            if (adminIndex !== -1) {
                                dbAdminData.admins.splice(adminIndex, 1);
                                localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));
                            }
                        }

                        users.splice(index, 1);

                        localStorage.setItem('users', JSON.stringify(users));

                        renderUsers(users);

                        showNotification('User deleted successfully.', 'success');
                    } else {
                        showNotification('User not found.', 'error');
                    }
                }
            }
        });
    }
});
