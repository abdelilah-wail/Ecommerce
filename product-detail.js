// Initialize variables
let cart = [];
let selectedStorage = null;

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Calculate total items in cart (sum of quantities)
function calculateTotalItems() {
    return cart.reduce((total, product) => total + (product.quantity || 1), 0);
}

// Update navbar cart count
function updateNavbarCartCount() {
    const cartLinks = document.querySelectorAll('.cart-logo');
    cartLinks.forEach(link => {
        link.textContent = `(${calculateTotalItems()})`;
    });
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart function
function addToCart(product, storageOption) {
    // Create a unique identifier combining title and storage
    const productId = `${product.title} - ${storageOption.capacity}`;

    // Check if product already exists in cart
    const existingProduct = cart.find(item =>
        item.title === product.title && item.selectedStorage === storageOption.capacity
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            ...product,
            selectedStorage: storageOption.capacity,
            price: storageOption.price,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    updateNavbarCartCount();

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
    notification.textContent = `${product.title} (${storageOption.capacity}) added to cart!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Show related products
function showRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById("related-products");
    relatedContainer.innerHTML = '';

    const related = products.filter(p =>
        p.category === currentProduct.category &&
        p.title !== currentProduct.title
    );

    if (related.length === 0) {
        relatedContainer.innerHTML = '<p class="text-lg">No related products found.</p>';
        return;
    }

    related.forEach(r => {
        const productCard = document.createElement('div');
        productCard.className = 'item-card text-white p-4 rounded-lg shadow-xl';

        // Use base price or first storage option price
        const displayPrice = r.storageOptions && r.storageOptions.length > 0 ?
            r.storageOptions[0].price : r.price;

        productCard.innerHTML = `
            <img src="${r.images[0]}" alt="${r.title}" class="ml-[20%] w-30 h-40 object-cover rounded-md">
            <h2 class="text-lg font-bold mt-2">
                <a href="product.html?title=${encodeURIComponent(r.title)}" class="text-black font-bold hover:underline">
                    ${r.title}
                </a>
            </h2>
            <p class="text-sm text-gray-600">${r.description}</p>
            <p class="text-lg font-bold mt-2 text-[#5C6BC0]">$${displayPrice}</p>
            <button class="add-to-cart-btn">
                Add to Cart
            </button>
        `;

        // Add event listener for related product's add to cart button
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const relatedProduct = products.find(p => p.title === r.title);
            if (relatedProduct.storageOptions && relatedProduct.storageOptions.length > 0) {
                // For products with storage options, use the first one by default
                addToCart(relatedProduct, relatedProduct.storageOptions[0]);
            } else {
                // For products without storage options
                addToCart(relatedProduct, { price: relatedProduct.price, capacity: '' });
            }
        });

        relatedContainer.appendChild(productCard);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateNavbarCartCount();

    // Get product from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productTitle = urlParams.get("title");
    const product = products.find(p => p.title === productTitle);

    if (!product) {
        document.getElementById("product-details").innerHTML = "<p>Product not found.</p>";
        return;
    }

    // Render product details with storage options
    let propertiesHTML = '';
    for (const key in product.properties) {
        propertiesHTML += `<p><strong>${key}:</strong> ${product.properties[key]}</p>`;
    }

    // Create storage options HTML if they exist
    let storageOptionsHTML = '';
    if (product.storageOptions && product.storageOptions.length > 0) {
        storageOptionsHTML = `
            <div class="mt-4">
                <h3 class="font-bold mb-2">Storage Options:</h3>
                <div class="flex flex-wrap gap-2 mb-4">
        `;

        product.storageOptions.forEach((option, index) => {
            storageOptionsHTML += `
                <button data-storage-index="${index}"
                        class="storage-option border px-4 py-2 rounded ${index === 0 ? 'bg-black text-white' : 'bg-white border-black'}  transition-colors">
                    ${option.capacity} ($${option.price})
                </button>
            `;
        });

        storageOptionsHTML += `</div></div>`;
        selectedStorage = product.storageOptions[0];
    } else {
        // For products without storage options
        selectedStorage = { price: product.price, capacity: '' };
    }

    // Render product details
    document.getElementById("product-details").innerHTML = `
        <img src="${product.images[0]}" alt="${product.title}" class="w-[400px] h-[420px] object-cover rounded-lg shadow-md">
        <div class="flex-grow">
            <h1 class="text-3xl font-bold text-black mb-4">${product.title}</h1>
            <p class="mb-2">${product.description}</p>
            ${storageOptionsHTML}
            <div class="text-sm text-gray-400 mt-4">
                ${propertiesHTML}
            </div>
            <button id="add-to-cart-btn" class="add-to-cart-btn">
                Add to Cart - $${selectedStorage.price}
            </button>
        </div>
    `;

    // Add event listeners for storage options if they exist
    if (product.storageOptions && product.storageOptions.length > 0) {
        document.querySelectorAll('.storage-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-storage-index');
                selectedStorage = product.storageOptions[index];

                // Update UI
                document.querySelectorAll('.storage-option').forEach(opt => {
                    opt.classList.remove('bg-black', 'text-white');
                    opt.classList.add('bg-white', 'border-black');
                });
                e.target.classList.add('bg-black', 'text-white');
                e.target.classList.remove('bg-white', 'border-black');

                // Update add to cart button price
                document.getElementById('add-to-cart-btn').textContent =
                    `Add to Cart - $${selectedStorage.price}`;
            });
        });
    }

    // Add to cart button event
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        addToCart(product, selectedStorage);
    });

    // Show related products
    showRelatedProducts(product);

    // Set active nav link
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("border-b-2", "border-black", "pb-1");
        }
    });
});
