document.addEventListener('DOMContentLoaded', function () {
    const ordersTableBody = document.querySelector('.scrollable-products tbody');
    const searchInput = document.querySelector('input[placeholder="Search orders..."]');
    const statusFilter = document.querySelector('select:nth-of-type(1)');
    const dateFilter = document.querySelector('select:nth-of-type(2)');
    const exportOrdersButton = document.getElementById('export-orders');

    if (!localStorage.getItem('dbOrders')) {
        localStorage.setItem('dbOrders', JSON.stringify(dbOrders));
    }

    let dbOrdersData = JSON.parse(localStorage.getItem('dbOrders'));
    let orders = dbOrdersData.orders;

    //! render
    function renderOrders(filteredOrders) {
        const searchResults = document.getElementById('searchResults');

        if (filteredOrders.length === 0) {
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-gray-500">
                        No orders found matching the selected filters.
                    </td>
                </tr>
            `;
            if (searchResults) {
                searchResults.innerHTML = `Showing <span class="font-medium">0</span> results`;
            }
            return;
        }

        ordersTableBody.innerHTML = filteredOrders.map(order => {
            let statusClasses = '';

            //! status
            if (order.status === 'Completed') {
                statusClasses = 'bg-green-100 text-green-800';
            } else if (order.status === 'Pending') {
                statusClasses = 'bg-yellow-100 text-yellow-800';
            } else if (order.status === 'Processing') {
                statusClasses = 'bg-blue-100 text-blue-800';
            } else if (order.status === 'Cancelled') {
                statusClasses = 'bg-red-100 text-red-800';
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

        //! search number
        if (searchResults) {
            searchResults.innerHTML = `Showing <span class="font-medium">${filteredOrders.length}</span> results`;
        }
    }

    //! CSV
    function exportOrdersToCSV() {
        const csvHeaders = ['Order ID', 'Customer', 'Date', 'Status', 'Total'];
        const csvRows = orders.map(order => [
            order.orderId,
            order.customer,
            new Date(order.date).toLocaleDateString(),
            order.status,
            `$${order.total.toFixed(2)}`
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n');

        //! download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'orders_history.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    exportOrdersButton.addEventListener('click', exportOrdersToCSV);

    renderOrders(orders);

    // Filter
    function applyFilters() {
        const searchKeyword = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedDateRange = dateFilter.value;

        let filteredOrders = orders;

        if (searchKeyword) {
            filteredOrders = filteredOrders.filter(order =>
                order.orderId.toLowerCase().includes(searchKeyword) ||
                order.customer.toLowerCase().includes(searchKeyword)
            );
        }

        if (selectedStatus !== 'All Status') {
            filteredOrders = filteredOrders.filter(order => order.status === selectedStatus);
        }

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

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    //! update/delete
    ordersTableBody.addEventListener('click', function (e) {
        const orderId = e.target.dataset.id;

        if (e.target.classList.contains('update-status-btn')) {
            const newStatus = prompt('Enter new status (Pending, Processing, Completed):');

            if (newStatus === null) {
                return;
            }

            if (['Pending', 'Processing', 'Completed'].includes(newStatus)) {
                const orderIndex = orders.findIndex(order => order.orderId === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = newStatus;

                    dbOrdersData.orders = orders;
                    localStorage.setItem('dbOrders', JSON.stringify(dbOrdersData));

                    renderOrders(orders);
                    alert('Order status updated successfully!');
                }
            } else {
                alert('Invalid status entered. Please enter one of the following: Pending, Processing, Completed.');
            }
        }

        if (e.target.classList.contains('delete-order-btn')) {
            if (confirm('Are you sure you want to delete this order?')) {
                orders = orders.filter(order => order.orderId !== orderId);

                dbOrdersData.orders = orders;
                localStorage.setItem('dbOrders', JSON.stringify(dbOrdersData));

                renderOrders(orders);
                alert('Order deleted successfully!');
            }
        }
    });
});