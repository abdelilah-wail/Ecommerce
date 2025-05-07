// purchase.js

// Load cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalAmount = 0;

// Calculate total from cart
function calculateCartTotal() {
    return cart.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
}

// Update order summary with actual cart data
function updateOrderSummary() {
    const subtotal = calculateCartTotal();
    totalAmount = subtotal; // No tax or shipping for cash on delivery

    // Get all summary elements
    const subtotalElement = document.querySelector('.subtotal-price');
    const taxElement = document.querySelector('.tax-price');
    const shippingElement = document.querySelector('.shipping-price');
    const totalElement = document.querySelector('.total-price');

    // Only update elements that exist
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = '$0.00';
    if (shippingElement) shippingElement.textContent = '$0.00';
    if (totalElement) totalElement.textContent = `$${totalAmount.toFixed(2)}`;
}

// Handle form submission
function handleCheckout(e) {
    e.preventDefault();

    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.getElementById('card').value.trim() ? 'Credit Card' : 'Cash on Delivery';

    if (!address) {
        showError('Please enter your delivery address');
        return;
    }

    completePurchase(paymentMethod);
}

// Handle cash on delivery
function handleCashOnDelivery() {
    const address = document.getElementById('address').value.trim();

    if (!address) {
        showError('Please enter your delivery address');
        return;
    }

    completePurchase('Cash on Delivery');
}

// Complete purchase and redirect
function completePurchase(paymentMethod) {
    // Create order object
    const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: [...cart],
        total: totalAmount,
        paymentMethod,
        address: document.getElementById('address').value.trim(),
        status: 'Processing'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');

    // Redirect to success page
    window.location.href = 'success.html';
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (errorElement && errorText) {
        errorText.textContent = message;
        errorElement.classList.remove('hidden');

        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 3000);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the purchase page
    if (window.location.pathname.includes('purchase.html')) {
        updateOrderSummary();

        const checkoutForm = document.getElementById('checkoutForm');
        const cashOnDeliveryBtn = document.getElementById('cashOnDeliveryBtn');

        if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckout);
        if (cashOnDeliveryBtn) cashOnDeliveryBtn.addEventListener('click', handleCashOnDelivery);
    }
});
