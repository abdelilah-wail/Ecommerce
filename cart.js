// // Load cart data from localStorage
// let cart = [];
// let cartCount = 0;

// function loadCartFromLocalStorage() {
//     const storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//         cart = JSON.parse(storedCart);
//         cartCount = cart.length;
//     }
// }

// // Function to update cart count in localStorage
// function updateCartCount() {
//     localStorage.setItem('cartCount', cartCount);
//     const cartLink = document.querySelector('.cart-logo');
//     if (cartLink) {
//         cartLink.textContent = `Cart (${cartCount})`;
//     }
// }

// // Function to display cart items
// function displayCartItems() {
//     const cartItemsDiv = document.getElementById('cart-items');
//     if (!cartItemsDiv) return; // Exit if cartItemsDiv is null

//     cartItemsDiv.innerHTML = '';
//     cart.forEach(product => {
//         const item = document.createElement('div');
//         item.className = 'item-card text-white p-4 rounded-lg shadow-xl';
//         item.innerHTML = `
//             <img src="${product.images[0]}" alt="${product.title}" class="ml-[20%] w-30 h-40 object-cover rounded-md">
//             <h2 class="text-lg font-bold mt-2">${product.title}</h2>
//             <p class="text-sm text-gray-600">${product.description}</p>
//             <p class="text-lg font-bold mt-2 text-[#5C6BC0]">$${product.price}</p>
//             <button class="remove-from-cart-btn">Remove</button>
//         `;
//         item.querySelector('.remove-from-cart-btn').addEventListener('click', () => {
//             removeItemFromCart(product);
//         });
//         cartItemsDiv.appendChild(item);
//     });
// }

// // Function to remove an item from the cart
// function removeItemFromCart(product) {
//     const index = cart.indexOf(product);
//     if (index !== -1) {
//         cart.splice(index, 1);
//         cartCount--;
//         updateCartCount();
//         saveCartToLocalStorage();
//         displayCartItems();
//     }
// }

// // Function to save cart data to localStorage
// function saveCartToLocalStorage() {
//     localStorage.setItem('cart', JSON.stringify(cart));
// }

// // Clear cart functionality
// const clearCartBtn = document.getElementById('clear-cart-btn');
// if (clearCartBtn) {
//     clearCartBtn.addEventListener('click', () => {
//         cart = [];
//         cartCount = 0;
//         updateCartCount();
//         saveCartToLocalStorage();
//         displayCartItems();
//     });
// }

// loadCartFromLocalStorage();
// displayCartItems();
// Load cart data from localStorage
let cart = [];

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Function to calculate the total number of items in the cart
function calculateTotalItems(cart) {
    return cart.length; // Simply return the length of the cart array
}

// Function to update the cart count in the navbar
function updateNavbarCartCount() {
    const cartLink = document.querySelector('.cart-logo');
    if (cartLink) {
        const totalItems = calculateTotalItems(cart); // Calculate total items
        cartLink.textContent = `(${totalItems})`;
    }
}

// Save cart data to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display cart items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    if (!cartItemsDiv) return;

    cartItemsDiv.innerHTML = '';
    cart.forEach(product => {
        const item = document.createElement('div');
        item.className = 'item-card text-white p-4 rounded-lg shadow-xl';
        item.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="ml-[20%] w-30 h-40 object-cover rounded-md">
            <h2 class="text-lg font-bold mt-2">${product.title}</h2>
            <p class="text-sm text-gray-600">${product.description}</p>
            <p class="text-lg font-bold mt-2 text-[#5C6BC0]">$${product.price}</p>
            <div class="flex justify-between items-center">
                <button class="confirm-from-cart-btn flex justify-center items-center gap-4">Purchase <img src="images/icons/success.svg" class="w-5 h-5" alt="" /></button>
                <button class="remove-from-cart-btn flex justify-center items-center gap-4">Remove <img src="images/icons/delete.svg" alt="" /></button>
            </div>
        `;
        item.querySelector('.remove-from-cart-btn').addEventListener('click', () => {
            removeItemFromCart(product);
        });
        cartItemsDiv.appendChild(item);
    });
}

// Remove item from cart
function removeItemFromCart(product) {
    const index = cart.indexOf(product);
    if (index !== -1) {
        cart.splice(index, 1); // Remove the product from the cart array
        saveCartToLocalStorage(); // Save updated cart data
        displayCartItems(); // Re-render cart items
        updateNavbarCartCount(); // Update the navbar cart count
    }
}

// Clear cart functionality
const clearCartBtn = document.getElementById('clear-cart-btn');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = []; // Clear the cart array
        saveCartToLocalStorage(); // Save empty cart data
        displayCartItems(); // Re-render cart items
        updateNavbarCartCount(); // Update the navbar cart count
    });
}

// Load cart data and update navbar cart count on page load
loadCartFromLocalStorage();
displayCartItems();
updateNavbarCartCount();

const currentPage = window.location.pathname.split("/").pop();
console.log(currentPage);
document.querySelectorAll(".nav-link").forEach(link => {
    console.log(link.getAttribute("href"));
    if (link.getAttribute("href") === currentPage) {
    link.classList.add("border-b-2", "border-black", "pb-1");
    }
});
