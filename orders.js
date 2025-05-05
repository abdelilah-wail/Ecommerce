document.addEventListener('DOMContentLoaded', function () {
    const ordersTableBody = document.querySelector('.scrollable-products tbody');
    const searchInput = document.querySelector('input[placeholder="Search orders..."]');
    const statusFilter = document.querySelector('select:nth-of-type(1)');
    const dateFilter = document.querySelector('select:nth-of-type(2)');

    // Initialize orders in localStorage if not already present
    if (!localStorage.getItem('dbOrders')) {
        localStorage.setItem('dbOrders', JSON.stringify(dbOrders));
    }

    // Fetch orders from localStorage
    let dbOrdersData = JSON.parse(localStorage.getItem('dbOrders'));
    let orders = dbOrdersData.orders;

    // Render orders in the table
    function renderOrders(filteredOrders) {
        if (filteredOrders.length === 0) {
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-gray-500">
                        No orders found matching the selected filters.
                    </td>
                </tr>
            `;
            return;
        }

        ordersTableBody.innerHTML = filteredOrders.map(order => {
            let statusClasses = '';

            switch (order.status) {
                case 'Completed':
                    statusClasses = 'bg-green-100 text-green-800';
                    break;
                case 'Pending':
                    statusClasses = 'bg-yellow-100 text-yellow-800';
                    break;
                case 'Processing':
                    statusClasses = 'bg-blue-100 text-blue-800';
                    break;
                case 'Cancelled':
                    statusClasses = 'bg-red-100 text-red-800';
                    break;
            }

            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.orderId}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.customer}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(order.date).toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}">
                            ${order.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${order.total.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="update-status-btn text-blue-600 hover:text-blue-900 mr-3" data-id="${order.orderId}">Update</button>
                        <button class="delete-order-btn text-red-600 hover:text-red-900" data-id="${order.orderId}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Initial render
    renderOrders(orders);

    // Filter orders
    function applyFilters() {
        const searchKeyword = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedDateRange = dateFilter.value;

        let filteredOrders = orders;

        // Filter by search keyword
        if (searchKeyword) {
            filteredOrders = filteredOrders.filter(order =>
                order.orderId.toLowerCase().includes(searchKeyword) ||
                order.customer.toLowerCase().includes(searchKeyword)
            );
        }

        // Filter by status
        if (selectedStatus !== 'All Status') {
            filteredOrders = filteredOrders.filter(order => order.status === selectedStatus);
        }

        // Filter by date range
        if (selectedDateRange !== 'All') {
            const now = new Date();
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date);
                switch (selectedDateRange) {
                    case 'Last 24 hours':
                        return now - orderDate <= 24 * 60 * 60 * 1000;
                    case 'Last 7 days':
                        return now - orderDate <= 7 * 24 * 60 * 60 * 1000;
                    case 'Last 30 days':
                        return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
                    default:
                        return true;
                }
            });
        }

        renderOrders(filteredOrders);
    }

    // Event listeners for filters
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    // Handle update and delete actions
    ordersTableBody.addEventListener('click', function (e) {
        const orderId = e.target.dataset.id;

        if (e.target.classList.contains('update-status-btn')) {
            const newStatus = prompt('Enter new status (Pending, Processing, Completed, Cancelled):');
            if (newStatus && ['Pending', 'Processing', 'Completed', 'Cancelled'].includes(newStatus)) {
                const orderIndex = orders.findIndex(order => order.orderId === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = newStatus;

                    // Save updated orders to localStorage
                    dbOrdersData.orders = orders;
                    localStorage.setItem('dbOrders', JSON.stringify(dbOrdersData));

                    renderOrders(orders);
                    alert('Order status updated successfully!');
                }
            } else {
                alert('Invalid status entered.');
            }
        }

        if (e.target.classList.contains('delete-order-btn')) {
            if (confirm('Are you sure you want to delete this order?')) {
                orders = orders.filter(order => order.orderId !== orderId);

                // Save updated orders to localStorage
                dbOrdersData.orders = orders;
                localStorage.setItem('dbOrders', JSON.stringify(dbOrdersData));

                renderOrders(orders);
                alert('Order deleted successfully!');
            }
        }
    });
});