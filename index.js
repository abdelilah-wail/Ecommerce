const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    console.log(link.getAttribute("href"));
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-black", "pb-1");
    }
});

let cart = []; // Make sure cart is declared

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Updated to sum quantities
function calculateTotalItems() {
    if (!cart) return 0;
    return cart.reduce((total, product) => total + (product.quantity || 1), 0);
}

// Function to update the cart count in the navbar
function updateNavbarCartCount() {
    const cartLinks = document.querySelectorAll('.cart-logo');
    if (cartLinks) {
        const totalItems = calculateTotalItems();
        cartLinks.forEach(link => {
            link.textContent = `(${totalItems})`;
        });
    }
}

// Initialize cart and update UI
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateNavbarCartCount();
});

// In index.html
function redirectToCategory(category) {
    window.location.href = `products.html?category=${encodeURIComponent(category)}`;
}
