// Initialize cart from localStorage
let cart = [];

// Load cart data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    displayCartItems();
    updateCartTotal();
    updateNavbarCartCount();
    setupEventListeners();
});

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Display all cart items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    if (!cartItemsDiv) return;

    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="text-lg">Your cart is empty</p>';
        return;
    }

    cart.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'item-card bg-white p-4 rounded-lg shadow-xl mb-4';
        item.dataset.productId = index;

        item.innerHTML = `
            <div class="flex flex-col gap-4">
                <img src="${Array.isArray(product.images) ? product.images[0] : product.images[product.colorOptions ? product.colorOptions[0] : '']}"
                     class="w-full ml-[25%] md:w-32 h-32 object-contain rounded-md">

                <div class="flex-grow">
                    <h2 class="text-lg font-bold">${product.title}</h2>
                    <p class="text-gray-600 text-sm mb-2">${product.description}</p>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <button class="decrease-quantity bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300">
                                -
                            </button>
                            <span class="quantity-display bg-gray-100 px-4 py-1">
                                ${product.quantity}
                            </span>
                            <button class="increase-quantity bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300">
                                +
                            </button>
                        </div>

                        <p class="text-lg font-bold text-[#5C6BC0]">
                            $${(product.price * product.quantity).toFixed(2)}
                        </p>
                    </div>

                    <div class="mt-4 flex justify-between space-x-2">
                        <button class="remove-from-cart-btn flex items-center justify-center gap-2 w-full
                                      bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">
                            <img src="images/icons/delete.svg" alt="Remove" class="w-4 h-4">
                            <span>Remove</span>
                        </button>

                        <button class="confirm-from-cart-btn flex items-center justify-center gap-2 w-full
                                      bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                            <img src="images/icons/success.svg" alt="Purchase" class="w-4 h-4">
                            <span>Purchase</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        cartItemsDiv.appendChild(item);
    });
}

// Update the cart total price display
function updateCartTotal() {
    const totalPriceElement = document.querySelector('.Total-cart-price');
    if (totalPriceElement) {
        const total = calculateCartTotal();
        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}

// Calculate total cart value
function calculateCartTotal() {
    return cart.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
}

// Update navbar cart count
function updateNavbarCartCount() {
    const totalItems = calculateTotalItems();
    const cartLinks = document.querySelectorAll('.cart-logo');

    cartLinks.forEach(link => {
        link.textContent = `(${totalItems})`;
    });
}

// Calculate total number of items (sum of quantities)
function calculateTotalItems() {
    return cart.reduce((total, product) => total + product.quantity, 0);
}

// Setup event listeners
function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
}

// Handle quantity changes and removals
document.addEventListener('click', function(e) {
    const itemCard = e.target.closest('.item-card');
    if (!itemCard) return;

    const productId = parseInt(itemCard.dataset.productId);
    const product = cart[productId];

    // Increase quantity
    if (e.target.classList.contains('increase-quantity')) {
        product.quantity += 1;
        saveCartAndRefresh();
    }

    // Decrease quantity
    if (e.target.classList.contains('decrease-quantity')) {
        if (product.quantity > 1) {
            product.quantity -= 1;
            saveCartAndRefresh();
        } else {
            removeItemFromCart(productId);
        }
    }

    // Remove item
    if (e.target.classList.contains('remove-from-cart-btn') ||
       e.target.closest('.remove-from-cart-btn')) {
        removeItemFromCart(productId);
    }

    // Purchase item
    if (e.target.classList.contains('confirm-from-cart-btn') ||
       e.target.closest('.confirm-from-cart-btn')) {
        // Redirect to purchase page
        window.location.href = 'purchase.html';
    }
});

// Remove item from cart
function removeItemFromCart(productId) {
    cart.splice(productId, 1);
    saveCartAndRefresh();
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCartAndRefresh();
    }
}

// Save cart and refresh display
function saveCartAndRefresh() {
    saveCartToLocalStorage();
    displayCartItems();
    updateCartTotal();
    updateNavbarCartCount();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Navigation active state
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-black", "pb-1");
    }
});
