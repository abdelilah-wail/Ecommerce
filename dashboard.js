document.addEventListener('DOMContentLoaded', function () {

    if (!localStorage.getItem('dbAdmin')) {
        localStorage.setItem('dbAdmin', JSON.stringify(dbAdmin));
    }

    if (!localStorage.getItem('dbOrders')) {
        localStorage.setItem('dbOrders', JSON.stringify(dbOrders));
    }

    if (!localStorage.getItem('dbProducts')) {
        localStorage.setItem('dbProducts', JSON.stringify(dbProducts));
    }

    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

    if (!isLoggedIn || !adminId) {
        window.location.href = 'login.html';
        return;
    }

    const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin'));
    const adminData = dbAdminData.admins.find(admin => admin.id === parseInt(adminId));

    if (adminData) {
        const nameElem = document.querySelector('.admin-name');
        const roleElem = document.querySelector('.admin-profile p.text-xs');
        const avatarElem = document.querySelector('.admin-avatar');

        if (nameElem) nameElem.textContent = adminData.name;
        if (roleElem) roleElem.textContent = adminData.role;
        if (avatarElem) avatarElem.src = adminData.image || 'images/avatar/default-avatar.png';
    }

    // Recent Orders
    const recentOrdersTableBody = document.getElementById('recent-orders');
    if (recentOrdersTableBody) {
        const dbOrdersData = JSON.parse(localStorage.getItem('dbOrders'));
        const recentOrders = dbOrdersData.orders.slice(-10).reverse();
        recentOrdersTableBody.innerHTML = recentOrders.map(order => `
            <tr>
                <td class="px-4 py-3 text-sm">${order.orderId}</td>
                <td class="px-4 py-3 text-sm">${order.customer}</td>
                <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
            }">${order.status}</span>
                </td>
                <td class="px-4 py-3 text-sm">$${order.total.toFixed(2)}</td>
            </tr>
        `).join('');
    }

    // Out of Stock Products
    const outOfStockTableBody = document.getElementById('out-of-stock-products');
    if (outOfStockTableBody) {
        const dbProductsData = JSON.parse(localStorage.getItem('dbProducts'));
        const outOfStockProducts = dbProductsData.products.filter(product => product.quantity === 0);
        outOfStockTableBody.innerHTML = outOfStockProducts.map(product => `
            <tr>
                <td class="px-4 py-3 text-sm flex items-center">
                    <img src="${product.images[0]}" alt="${product.title}" class="w-8 h-8 rounded mr-3"/>
                    <span>${product.title}</span>
                </td>
                <td class="px-4 py-3 text-sm">${product.id}</td>
                <td class="px-4 py-3 text-sm">${product.category}</td>
                <td class="px-4 py-3 text-sm">
                    <span class="text-red-600 font-medium">0</span>
                </td>
            </tr>
        `).join('');
    }

    // Dashboard Stats
    const totalRevenueElem = document.getElementById('total-revenue');
    const totalOrdersElem = document.getElementById('total-orders');
    const totalProductsElem = document.getElementById('total-products');
    const totalCustomersElem = document.getElementById('total-customers');

    if (totalRevenueElem && totalOrdersElem && totalProductsElem && totalCustomersElem) {
        const dbOrdersData = JSON.parse(localStorage.getItem('dbOrders'));
        const dbProductsData = JSON.parse(localStorage.getItem('dbProducts'));

        const totalRevenue = dbOrdersData.orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = dbOrdersData.orders.length;
        const totalProducts = dbProductsData.products.length;
        const uniqueCustomers = new Set(dbOrdersData.orders.map(order => order.customer)).size;

        totalRevenueElem.textContent = `$${totalRevenue.toFixed(2)}`;
        totalOrdersElem.textContent = totalOrders;
        totalProductsElem.textContent = totalProducts;
        totalCustomersElem.textContent = uniqueCustomers;
    }
});