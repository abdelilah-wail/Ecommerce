
// profile.js
import { getCurrentUser, logout } from './auth.js';

// DOM Elements
const profileForm = document.getElementById('profileForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    loadUserData(user.id);
    loadOrderHistory(user.id); // Load orders for current user
    initCart();
    setActiveNavLink();
});

// Load user data
function loadUserData(userId) {
    try {
        const users = JSON.parse(localStorage.getItem('usersDB')) || [];
        const user = users.find(u => u.id === userId);

        if (user) {
            nameInput.value = user.username || '';
            emailInput.value = user.email || '';
            phoneInput.value = user.phone || '';
            addressInput.value = user.address || '';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load and display order history
function loadOrderHistory(userId) {
    const orderHistoryDiv = document.getElementById('order-history');
    if (!orderHistoryDiv) return;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order =>
        order.id && order.items && order.date && order.total
    );

    if (userOrders.length === 0) {
        orderHistoryDiv.innerHTML = `
            <div class="bg-gray-100 p-6 rounded-lg text-center">
                <p class="text-gray-600 mb-4">You haven't placed any orders yet</p>
                <a href="products.html" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    orderHistoryDiv.innerHTML = '';

    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    userOrders.forEach(order => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderElement = document.createElement('div');
        orderElement.className = 'bg-gray-100 p-4 rounded-lg mb-4';
        orderElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-md font-bold">Order #${order.id.slice(-6)}</h3>
                    <p class="text-sm text-gray-600">${formattedDate}</p>
                    <p class="text-sm text-gray-600">${order.paymentMethod || 'Cash on Delivery'}</p>
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                }">
                    ${order.status || 'Processing'}
                </span>
            </div>
            <div class="mt-3">
                ${order.items.slice(0, 2).map(item => `
                    <div class="flex items-center mb-2">
                        <img src="${Array.isArray(item.images) ? item.images[0] : item.images}"
                             class="w-10 h-10 object-contain mr-2">
                        <div>
                            <p class="text-sm font-medium">${item.title}</p>
                            <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
                        </div>
                    </div>
                `).join('')}
                ${order.items.length > 2 ?
                    `<p class="text-sm text-gray-500 mt-1">+ ${order.items.length - 2} more items</p>` : ''
                }
            </div>
            <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <p class="text-sm font-bold ">Total:$${order.total.toFixed(2)}</p>

            </div>
        `;

        orderHistoryDiv.appendChild(orderElement);
    });

}

// Save user data
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) return;

    try {
        const users = JSON.parse(localStorage.getItem('usersDB')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                username: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                address: addressInput.value.trim(),
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem('usersDB', JSON.stringify(users));

            // Update session
            const currentUser = {
                ...user,
                username: nameInput.value.trim(),
                email: emailInput.value.trim()
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showNotification('Profile updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Error saving user data:', error);
        showNotification('Failed to update profile', 'error');
    }
});

// Cart functions
let cart = [];

function initCart() {
    loadCartFromLocalStorage();
    updateNavbarCartCount();
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];
}

function calculateTotalItems() {
    return cart.reduce((total, product) => total + (product.quantity || 1), 0);
}

function updateNavbarCartCount() {
    const totalItems = calculateTotalItems();
    document.querySelectorAll('.cart-logo').forEach(el => {
        el.textContent = `(${totalItems})`;
    });
}

// Navigation functions
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('border-b-2', 'border-black', 'pb-1');
        }
    });
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}
