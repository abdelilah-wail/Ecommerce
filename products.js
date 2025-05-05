// Initialize cart array
let cart = [];
let currentProducts = []; // To track currently displayed products

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
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

// Add to cart function
function addToCart(product, storageOption = null) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `login.html?returnUrl=${returnUrl}`;
        return;
    }

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
    notification.textContent = `Added ${product.title}${storageOption ? ` (${storageOption.capacity})` : ''} to cart!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Render products to the grid
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.error('Element with ID "products-grid" not found.');
        return;
    }

    productsGrid.innerHTML = "";

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p class="col-span-3 text-center text-lg">No products found matching your search.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'item-card text-white p-4 rounded-lg shadow-xl';

        // Get first image (works for both array and object formats)
        const firstImage = Array.isArray(product.images) ?
            product.images[0] :
            product.images[Object.keys(product.images)[0]];

        // Check if product has storage options
        const hasStorageOptions = product.storageOptions && product.storageOptions.length > 0;
        const basePrice = hasStorageOptions ? product.storageOptions[0].price : product.price;

        productCard.innerHTML = `
            <div class="flex flex-col h-full">
                <img src="${firstImage}" alt="${product.title}"
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
                    <button class="add-to-cart-btn">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isLoggedIn()) {
                    const returnUrl = encodeURIComponent(window.location.href);
                    window.location.href = `login.html?returnUrl=${returnUrl}`;
                    return;
                }

                if (product.storageOptions && product.storageOptions.length > 0) {
                    // For products with storage options, redirect to product detail page
                    window.location.href = `product.html?title=${encodeURIComponent(product.title)}`;
                } else {
                    // For products without storage options, add directly to cart
                    addToCart(product, { price: product.price, capacity: '' });
                }
            });
        }

        productsGrid.appendChild(productCard);
    });
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    // Get the currently active category
    const activeCategory = document.querySelector('.category-link.active');
    const currentCategory = activeCategory ? activeCategory.dataset.category : "All";

    // First filter by category if not "All"
    let filteredProducts = currentCategory === "All"
        ? [...products]
        : products.filter(p => p.category === currentCategory);

    // Then apply search filter if there's a search term
    if (searchTerm !== '') {
        filteredProducts = filteredProducts.filter(product => {
            const titleMatch = product.title.toLowerCase().includes(searchTerm);
            const brandMatch = product.properties.brand.toLowerCase().includes(searchTerm);
            return titleMatch || brandMatch;
        });
    }

    currentProducts = filteredProducts;
    renderProducts(currentProducts);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateNavbarCartCount();

    // Initialize with all products
    currentProducts = [...products];
    renderProducts(currentProducts);

    // Setup search functionality
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Category filtering with enhanced styling
    document.querySelectorAll(".category-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const category = link.dataset.category;

            // Update active category styling with transition
            document.querySelectorAll('.category-link').forEach(link => {
                link.classList.remove('active');
            });

            e.target.classList.add('active');

            if (category === "All") {
                currentProducts = [...products];
            } else {
                currentProducts = products.filter(p => p.category === category);
            }
            renderProducts(currentProducts);

            // Reset search input when category changes
            if (searchInput) searchInput.value = '';
        });
    });

    // Set initial active category (All) with styling
    const allCategoryLink = document.querySelector('.category-link[data-category="All"]');
    if (allCategoryLink) {
        allCategoryLink.classList.add('active');
    }

    // Navigation active state
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("border-b-2", "border-black", "pb-1");
        }
    });
});

// Import auth function
import { isLoggedIn } from './auth.js';
