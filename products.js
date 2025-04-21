
// Initialize cart array and cart count
let cart = [];
let cartCount = 0;

// Get references to DOM elements
const urlParams = new URLSearchParams(window.location.search);
const cartLink = document.querySelector('.cart-logo');
const category = urlParams.get('category');

if (category) {
    const filteredProducts = products.filter(product => product.category === category);
    renderProducts(filteredProducts);
} else {
    renderProducts(products);
}

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

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="ml-[10%] w-30 h-40 object-cover rounded-md">
            <h2 class="text-lg font-bold mt-2">
                <a href="product.html?title=${encodeURIComponent(product.title)}" class="text-black font-bold hover:underline">
                    ${product.title}
                </a>
            </h2>
            <p class="text-sm text-gray-600">${product.description}</p>
            <p class="text-lg font-bold mt-2 text-[#5C6BC0]">$${product.price}</p>
            <button class="add-to-cart-btn">
                Add to Cart
            </button>
        `;

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cart.push(product);
                cartCount++;
                console.log(`Added to cart: ${product.title}`);
                updateCartCount();
                saveCartToLocalStorage();
                updateNavbarCartCount();
            });
        }

        productsGrid.appendChild(productCard);
    });
}

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

// Function to update cart count in localStorage
function updateCartCount() {
    localStorage.setItem('cartCount', cartCount);
}

// Function to save cart data to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart data from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        cartCount = cart.length;
    }
}
function calculateTotalItems(cart) {
    return  cart.length;
}

// Function to update the cart count in the navbar
function updateNavbarCartCount() {
    const cartLink = document.querySelector('.cart-logo');
    if (cartLink) {
        const totalItems = calculateTotalItems(cart);
        cartLink.textContent = `(${totalItems})`;
    }
}
loadCartFromLocalStorage();
updateNavbarCartCount();

// Navigation active state
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-black", "pb-1");
    }
});
