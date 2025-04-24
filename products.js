// Initialize cart array
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateNavbarCartCount();

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    } else {
        renderProducts(products);
    }
});

function renderProducts(filteredProducts) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.error('Element with ID "products-grid" not found.');
        return;
    }

    productsGrid.innerHTML = "";
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'item-card text-white p-4 rounded-lg shadow-xl';

        // Check if product has storage options
        const hasStorageOptions = product.storageOptions && product.storageOptions.length > 0;
        const basePrice = hasStorageOptions ? product.storageOptions[0].price : product.price;

        productCard.innerHTML = `
            <div class="flex flex-col h-full">
                <img src="${product.images[0]}" alt="${product.title}"
                    class="w-full h-48 object-contain mx-auto">
                <div class="flex-grow flex flex-col justify-between p-2">
                    <div>
                        <h2 class="text-lg font-bold mt-2">
                            <a href="product.html?title=${encodeURIComponent(product.title)}"
                            class="text-black font-bold hover:underline">
                                ${product.title}
                            </a>
                        </h2>
                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">${product.description}</p>
                        <p class="text-lg font-bold mt-2 text-[#5C6BC0]">$${basePrice}</p>
                    </div>
                    <button class="add-to-cart-btn ">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (product.storageOptions && product.storageOptions.length > 0) {
                    // For products with storage options, redirect to product detail page
                    window.location.href = `product.html?title=${encodeURIComponent(product.title)}`;
                } else {
                    // For products without storage options, add directly to cart
                    addToCart(product);
                }
            });
        }

        productsGrid.appendChild(productCard);
    });
}

function addToCart(product, storageOption = null) {
    // Create a unique identifier
    const productId = storageOption ?
        `${product.title} - ${storageOption.capacity}` :
        product.title;

    // Check if product already exists in cart
    const existingProduct = cart.find(item =>
        storageOption ?
        (item.title === product.title && item.selectedStorage === storageOption.capacity) :
        (item.title === product.title)
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const productToAdd = {
            ...product,
            quantity: 1
        };

        if (storageOption) {
            productToAdd.selectedStorage = storageOption.capacity;
            productToAdd.price = storageOption.price;
        }

        cart.push(productToAdd);
    }

    saveCartToLocalStorage();
    updateNavbarCartCount();

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
    notification.textContent = `Added ${product.title}${storageOption ? ` (${storageOption.capacity})` : ''} to cart`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Update navbar cart count
function updateNavbarCartCount() {
    const totalItems = calculateTotalItems();
    const cartLinks = document.querySelectorAll('.cart-logo');

    cartLinks.forEach(link => {
        if (link) {
            link.textContent = `(${totalItems})`;
        }
    });
}

// Calculate total number of items (sum of quantities)
function calculateTotalItems() {
    return cart.reduce((total, product) => total + (product.quantity || 1), 0);
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Category filtering
document.querySelectorAll(".category-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        if (category === "All") {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
        }
    });
});

// Navigation active state
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-black", "pb-1");
    }
});
