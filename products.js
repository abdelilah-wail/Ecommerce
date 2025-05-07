document.addEventListener('DOMContentLoaded', function () {
    const productsTableBody = document.querySelector('.scrollable-products tbody');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const categoryFilter = document.querySelector('select#categoryFilter');
    const statusFilter = document.querySelector('select#statusFilter');

    if (productsTableBody) {

        if (!localStorage.getItem('dbProducts')) {
            localStorage.setItem('dbProducts', JSON.stringify(dbProducts));
        }

        let dbProductsData = JSON.parse(localStorage.getItem('dbProducts'));
        let products = dbProductsData.products;

        function renderProducts(filteredProducts) {
            if (filteredProducts.length === 0) {
                productsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4 text-gray-500">
                            No products found matching the selected filters.
                        </td>
                    </tr>
                `;
                searchResults.innerHTML = `Showing <span class="font-medium">0</span> results`;
                return;
            }

            productsTableBody.innerHTML = filteredProducts.map(product => {
                let statusLabel = '';
                let statusClasses = '';

                if (product.quantity === 0 && product.status === 'Out of Stock') {
                    statusLabel = 'Out of Stock';
                    statusClasses = 'bg-red-100 text-red-800';
                } else if (product.status === 'Inactive') {
                    statusLabel = 'Inactive';
                    statusClasses = 'bg-yellow-100 text-yellow-800';
                } else {
                    statusLabel = 'Active';
                    statusClasses = 'bg-green-100 text-green-800';
                }

                return `
                    <tr data-id="${product.id}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <img class="h-10 w-10 rounded" src="${product.images[0]}" alt="${product.title}" onerror="this.onerror=null; this.src='images/product/default.png';">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${product.title}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.properties.brand}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.quantity}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}">
                                ${statusLabel}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href="#" class="edit-btn text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                            <a href="#" class="delete-btn text-red-600 hover:text-red-900">Delete</a>
                        </td>
                    </tr>
                `;
            }).join('');

            searchResults.innerHTML = `Showing <span class="font-medium">${filteredProducts.length}</span> results`;
        }

        renderProducts(products);

        function applyFilters() {
            const searchKeyword = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;
            const selectedStatus = statusFilter.value;

            let filteredProducts = [...products];

            if (searchKeyword) {
                filteredProducts = filteredProducts.filter(product =>
                    product.title.toLowerCase().includes(searchKeyword) ||
                    product.properties.brand.toLowerCase().includes(searchKeyword)
                );
            }

            if (selectedCategory !== 'All Categories') {
                filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
            }

            if (selectedStatus !== 'All Status') {
                filteredProducts = filteredProducts.filter(product => {
                    if (selectedStatus === 'Active') {
                        return product.status === 'Active';
                    } else if (selectedStatus === 'Out of Stock') {
                        return product.quantity === 0;
                    } else if (selectedStatus === 'Inactive') {
                        return product.status === 'Inactive';
                    }
                    return true;
                });
            }

            renderProducts(filteredProducts);
        }

        //! kl mayatbadal option ydir applyFilters
        categoryFilter.addEventListener('change', applyFilters);
        statusFilter.addEventListener('change', applyFilters);

        //! search
        searchInput.addEventListener('input', () => {
            applyFilters();
        });

        //! delete
        productsTableBody.addEventListener('click', function (e) {
            if (e.target.classList.contains('delete-btn')) {
                e.preventDefault();
                const row = e.target.closest('tr');
                const id = parseInt(row.dataset.id, 10);

                dbProductsData.products = dbProductsData.products.filter(p => p.id !== id);

                products = dbProductsData.products;

                localStorage.setItem('dbProducts', JSON.stringify(dbProductsData));

                renderProducts(products);
            }
        });

        //! edit
        productsTableBody.addEventListener('click', function (e) {
            if (e.target.classList.contains('edit-btn')) {
                e.preventDefault();
                const row = e.target.closest('tr');
                const productId = row.dataset.id;

                window.location.href = `/edit-product.html?id=${productId}`;
            }
        });
    }
});
