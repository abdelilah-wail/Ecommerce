// profile.js

// Import auth functions
import { getCurrentUser, logout } from './auth.js';

// DOM Elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const saveBtn = document.querySelector('button[type="button"]');
const logoutBtn = document.getElementById('logoutBtn');

// Load user data
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();

    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Load user data from database
    loadUserData(user.id);
});

// Load user data from database
function loadUserData(userId) {
    // In a real app, you would fetch from your backend
    // For now we'll use localStorage
    const users = JSON.parse(localStorage.getItem('usersDB')) || [];
    const user = users.find(u => u.id === userId);

    if (user) {
        // Populate form fields
        nameInput.value = user.username || '';
        emailInput.value = user.email || '';
        phoneInput.value = user.phone || '';
        addressInput.value = user.address || ''; // Make sure address exists in your user object

        // Update profile picture if available
        const profileImg = document.querySelector('.nav-link img[alt="profile icon"]');
        if (user.profileImage && profileImg) {
            profileImg.src = user.profileImage;
        }
    }
}

// Save user data
saveBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    const users = JSON.parse(localStorage.getItem('usersDB')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            username: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('usersDB', JSON.stringify(users));

        // Update current user session
        const currentUser = {
            ...user,
            username: nameInput.value.trim()
        };

        if (localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        // Show success message
        alert('Profile updated successfully!');
    }
});

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Cart functionality (same as other pages)
let cart = [];

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function calculateTotalItems() {
    return cart.reduce((total, product) => total + (product.quantity || 1), 0);
}

function updateNavbarCartCount() {
    const cartLinks = document.querySelectorAll('.cart-logo');
    cartLinks.forEach(link => {
        link.textContent = `(${calculateTotalItems()})`;
    });
}

// Initialize cart
loadCartFromLocalStorage();
updateNavbarCartCount();

// Set active nav link
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("border-b-2", "border-black", "pb-1");
    }
});
