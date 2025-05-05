document.addEventListener('DOMContentLoaded', function () {
    const storageOptions = document.querySelectorAll('input[name="storage-options"]');

    // Add event listeners to toggle price input fields
    storageOptions.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            const priceInput = document.getElementById(`price-${checkbox.id.split('-')[1]}`);
            if (checkbox.checked) {
                priceInput.removeAttribute('disabled');
            } else {
                priceInput.setAttribute('disabled', 'true');
                priceInput.value = '';
            }
        });
    });

    const form = document.getElementById('add-product-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Select all elements by id
        const id = parseInt(document.getElementById('product-sku').value.trim(), 10);
        const title = document.getElementById('product-name').value.trim();
        const description = document.getElementById('product-description').value.trim();
        const fileInput = document.getElementById('file-upload');
        const category = document.getElementById('product-category').value.trim();
        const brand = document.getElementById('product-brand').value.trim();
        const screen = document.getElementById('product-screen').value.trim();
        const quantity = parseInt(document.getElementById('product-stock').value.trim(), 10);
        const status = document.getElementById('product-status').value.trim();

        // Validate required fields
        if (!id || !title || !description || !brand || isNaN(quantity) || !status) {
            alert('Please fill in all required fields.');
            return;
        }

        // Handle file upload
        let imageMain = '';
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            imageMain = URL.createObjectURL(file); // Create a temporary URL for the uploaded file
        }

        const colorOptions = Array.from(document.querySelectorAll('input[name="color-options"]:checked')).map(el => {
            return { color: el.value };
        });

        const storageOptions = Array.from(document.querySelectorAll('input[name="storage-options"]:checked')).map(el => {
            const priceInput = document.getElementById(`price-${el.id.split('-')[1]}`);
            const price = parseFloat(priceInput.value.trim());
            return { capacity: el.value, price };
        }).filter(option => option.capacity && !isNaN(option.price));

        if (colorOptions.length === 0 || storageOptions.length === 0) {
            alert('Please provide at least one valid color option and one valid storage option.');
            return;
        }

        const dbProduct = JSON.parse(localStorage.getItem('dbProducts')) || { products: [] };

        const newProduct = {
            id,
            title,
            description,
            images: [imageMain], // Use the temporary URL for the image
            category,
            properties: {
                brand,
                screen
            },
            colorOptions,
            storageOptions,
            quantity,
            status
        };

        dbProduct.products.push(newProduct);
        localStorage.setItem('dbProducts', JSON.stringify(dbProduct));

        alert('Product saved successfully!');
        form.reset();
    });
});