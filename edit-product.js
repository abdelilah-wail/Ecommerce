document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('No product ID provided.');
        window.location.href = '/products.html';
        return;
    }

    //! get data
    const dbProductsData = JSON.parse(localStorage.getItem('dbProducts'));
    const product = dbProductsData.products.find(p => p.id === parseInt(productId));

    if (!product) {
        alert('Product not found.');
        window.location.href = '/products.html';
        return;
    }

    document.getElementById('product-name').value = product.title;
    document.getElementById('product-sku').value = product.id || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-brand').value = product.properties.brand || '';
    document.getElementById('product-screen').value = product.properties.screen || '';
    document.getElementById('product-status').value = product.status;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-stock').value = product.quantity;

    product.colorOptions.forEach(option => {
        const colorCheckbox = document.querySelector(`input[name="color-options"][value="${option.color}"]`);
        if (colorCheckbox) {
            colorCheckbox.checked = true;
        }
    });

    product.storageOptions.forEach(option => {
        const storageCheckbox = document.querySelector(`input[name="storage-options"][value="${option.capacity}"]`);
        const priceInput = document.querySelector(`#price-${option.capacity.toLowerCase()}`);
        if (storageCheckbox && priceInput) {
            storageCheckbox.checked = true;
            priceInput.value = option.price;
            priceInput.disabled = false;
        }
    });

    //! price
    const storageCheckboxes = document.querySelectorAll('input[name="storage-options"]');
    storageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const priceInput = document.querySelector(`#price-${this.value.toLowerCase()}`);
            if (this.checked) {
                priceInput.disabled = false;
            } else {
                priceInput.disabled = true; 
                priceInput.value = ''; 
            }
        });
    });

    //! save 
    const saveButton = document.querySelector('button[type="submit"]');
    saveButton.addEventListener('click', function (e) {
        e.preventDefault();

        const updatedProduct = {
            ...product,
            title: document.getElementById('product-name').value.trim(),
            sku: document.getElementById('product-sku').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            properties: {
                ...product.properties,
                brand: document.getElementById('product-brand').value.trim(),
                screen: document.getElementById('product-screen').value.trim(),
            },
            status: document.getElementById('product-status').value,
            category: document.getElementById('product-category').value,
            quantity: parseInt(document.getElementById('product-stock').value, 10),
            colorOptions: Array.from(document.querySelectorAll('input[name="color-options"]:checked')).map(checkbox => ({
                color: checkbox.value,
            })),
            storageOptions: Array.from(document.querySelectorAll('input[name="storage-options"]:checked')).map(checkbox => {
                const priceInput = document.querySelector(`#price-${checkbox.value.toLowerCase()}`);
                const price = parseFloat(priceInput.value);

                //! price negative
                if (price < 0) {
                    alert(`Price for ${checkbox.value} cannot be negative.`);
                    throw new Error('Invalid price');
                }

                return {
                    capacity: checkbox.value,
                    price: price,
                };
            }),
        };

        //! required
        if (!updatedProduct.title || !updatedProduct.category || isNaN(updatedProduct.quantity)) {
            alert('Please fill in all required fields.');
            return;
        }

        //! quantity negative)
        if (updatedProduct.quantity < 0) {
            alert('Quantity cannot be negative.');
            return;
        }

        //! status
        if (updatedProduct.quantity === 0) {
            if (updatedProduct.status === 'Active') {
                updatedProduct.status = 'Out of Stock';
            } else if (updatedProduct.status === 'Inactive') {
                updatedProduct.status = 'Inactive';
            }
        }

        const productIndex = dbProductsData.products.findIndex(p => p.id === parseInt(productId));
        if (productIndex !== -1) {
            dbProductsData.products[productIndex] = updatedProduct;
            localStorage.setItem('dbProducts', JSON.stringify(dbProductsData));
            alert('Product updated successfully!');
            window.location.href = '/products.html';
        } else {
            alert('Failed to update product.');
        }
    });
});